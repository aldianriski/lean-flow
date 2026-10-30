package httpapi_test

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"reflect"
	"testing"

	"clinic/internal/db"
)

func itoa(n int64) string { return fmt.Sprint(n) }

func queryID(t *testing.T, sql string) int64 {
	t.Helper()
	pool, err := db.Connect(context.Background())
	if err != nil {
		t.Fatal(err)
	}
	defer pool.Close()
	var id int64
	if err := pool.QueryRow(context.Background(), sql).Scan(&id); err != nil {
		t.Fatal(err)
	}
	return id
}

func (e *env) post(t *testing.T, path string) (int, map[string]any) {
	t.Helper()
	res, err := http.Post(e.srv.URL+path, "application/json", nil)
	if err != nil {
		t.Fatal(err)
	}
	defer res.Body.Close()
	var out map[string]any
	_ = json.NewDecoder(res.Body).Decode(&out)
	return res.StatusCode, out
}

func ids(t *testing.T, body map[string]any, key string) []int64 {
	t.Helper()
	raw, ok := body[key].([]any)
	if !ok {
		t.Fatalf("%q must be a JSON array, got %v", key, body[key])
	}
	out := []int64{}
	for _, v := range raw {
		out = append(out, int64(v.(float64)))
	}
	return out
}

// The fixed clock in setup is 2030-01-01T00:00:00Z.
func TestCancelAllForPatient(t *testing.T) {
	e := setup(t)
	a := e.insertAppointment(t, "2030-01-02T00:00:00Z") // exactly 24h away: cancellable
	b := e.insertAppointment(t, "2030-01-01T10:00:00Z") // 10h away: stays
	c := e.insertAppointment(t, "2030-01-10T03:00:00Z") // well ahead: cancellable
	other := queryID(t, `INSERT INTO patients(name, date_of_birth, phone) VALUES('P Two','1991-01-01','+62 811 0000 002') RETURNING id`)
	exec(t, `INSERT INTO appointments(doctor_id, patient_id, slot_start) VALUES($1,$2,'2030-01-12T03:00:00Z')`, e.doctorID, other)

	status, body := e.post(t, "/api/patients/"+itoa(e.patientID)+"/cancel-all")
	if status != http.StatusOK {
		t.Fatalf("status %d body %v", status, body)
	}
	if got := ids(t, body, "cancelled"); !reflect.DeepEqual(got, []int64{a, c}) {
		t.Fatalf("cancelled = %v, want %v", got, []int64{a, c})
	}
	if got := ids(t, body, "kept"); !reflect.DeepEqual(got, []int64{b}) {
		t.Fatalf("kept = %v, want %v", got, []int64{b})
	}
	// Only the kept appointment and the other patient's one remain.
	if n := e.appointmentCount(t); n != 2 {
		t.Fatalf("rows left = %d, want 2", n)
	}
	// The freed slot can be booked again straight away.
	if status, body := e.book(t, e.doctorID, "2030-01-10T03:00:00Z"); status != http.StatusCreated {
		t.Fatalf("freed slot: %d %v", status, body)
	}
}

func TestCancelAllWithNothingToCancel(t *testing.T) {
	e := setup(t)
	status, body := e.post(t, "/api/patients/"+itoa(e.patientID)+"/cancel-all")
	if status != http.StatusOK || len(ids(t, body, "cancelled")) != 0 || len(ids(t, body, "kept")) != 0 {
		t.Fatalf("%d %v", status, body)
	}
}

func TestCancelAllRefusals(t *testing.T) {
	e := setup(t)
	status, body := e.post(t, "/api/patients/99999/cancel-all")
	if status != http.StatusNotFound || faultCode(t, body) != "UNKNOWN_PATIENT" {
		t.Fatalf("unknown patient: %d %v", status, body)
	}
	status, body = e.post(t, "/api/patients/abc/cancel-all")
	if status != http.StatusBadRequest || faultCode(t, body) != "INVALID_REQUEST" {
		t.Fatalf("bad id: %d %v", status, body)
	}
	status, body = e.raw(t, http.MethodGet, "/api/patients/1/cancel-all")
	if status != http.StatusMethodNotAllowed || faultCode(t, body) != "METHOD_NOT_ALLOWED" {
		t.Fatalf("wrong method: %d %v", status, body)
	}
}
