package httpapi_test

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
	"testing"
)

func (e *env) series(t *testing.T, doctorID, patientID int64, slots ...string) (int, map[string]any) {
	t.Helper()
	quoted := make([]string, len(slots))
	for i, s := range slots {
		quoted[i] = fmt.Sprintf("%q", s)
	}
	body := fmt.Sprintf(`{"doctorId":%d,"patientId":%d,"slotStarts":[%s]}`, doctorID, patientID, strings.Join(quoted, ","))
	res, err := http.Post(e.srv.URL+"/api/appointments/series", "application/json", strings.NewReader(body))
	if err != nil {
		t.Fatal(err)
	}
	defer res.Body.Close()
	var out map[string]any
	_ = json.NewDecoder(res.Body).Decode(&out)
	return res.StatusCode, out
}

func TestSeriesBooksEverySlotInOrder(t *testing.T) {
	e := setup(t)
	slots := []string{"2030-01-03T03:00:00Z", "2030-01-02T03:00:00Z", "2030-01-09T03:00:00Z"}
	status, body := e.series(t, e.doctorID, e.patientID, slots...)
	if status != http.StatusCreated {
		t.Fatalf("status %d body %v", status, body)
	}
	list, ok := body["appointments"].([]any)
	if !ok || len(list) != len(slots) {
		t.Fatalf("want %d appointments, got %v", len(slots), body)
	}
	for i, item := range list {
		a := item.(map[string]any)
		if a["slotStart"] != slots[i] || a["id"] == nil || a["doctorId"] == nil || a["patientId"] == nil {
			t.Fatalf("entry %d: want slot %s in the booking shape, got %v", i, slots[i], a)
		}
	}
	if n := e.appointmentCount(t); n != 3 {
		t.Fatalf("want 3 stored appointments, got %d", n)
	}
}

func TestSeriesIsAllOrNothing(t *testing.T) {
	cases := []struct {
		name   string
		prep   func(e *env, t *testing.T)
		slots  []string
		status int
		code   string
		stored int
	}{
		{"a slot already taken", func(e *env, t *testing.T) { e.insertAppointment(t, "2030-01-03T03:00:00Z") },
			[]string{"2030-01-02T03:00:00Z", "2030-01-03T03:00:00Z", "2030-01-04T03:00:00Z"}, http.StatusConflict, "SLOT_TAKEN", 1},
		{"the same slot listed twice", nil,
			[]string{"2030-01-02T03:00:00Z", "2030-01-03T03:00:00Z", "2030-01-02T03:00:00Z"}, http.StatusConflict, "SLOT_TAKEN", 0},
		{"the series itself would pass the daily cap", func(e *env, t *testing.T) {
			exec(t, `UPDATE doctors SET daily_cap=2 WHERE id=$1`, e.doctorID)
		}, []string{"2030-01-02T02:00:00Z", "2030-01-02T03:00:00Z", "2030-01-02T04:00:00Z"}, http.StatusConflict, "DAILY_CAP_REACHED", 0},
		{"a slot outside working hours", nil,
			[]string{"2030-01-02T03:00:00Z", "2030-01-03T12:00:00Z"}, http.StatusUnprocessableEntity, "OUTSIDE_WORKING_HOURS", 0},
	}
	for _, c := range cases {
		t.Run(c.name, func(t *testing.T) {
			e := setup(t)
			if c.prep != nil {
				c.prep(e, t)
			}
			status, body := e.series(t, e.doctorID, e.patientID, c.slots...)
			if status != c.status || faultCode(t, body) != c.code {
				t.Fatalf("got %d %v, want %d %s", status, body, c.status, c.code)
			}
			if n := e.appointmentCount(t); n != c.stored {
				t.Fatalf("a refused series must leave nothing behind: want %d stored appointments, got %d", c.stored, n)
			}
		})
	}
}

func TestSeriesRefusals(t *testing.T) {
	e := setup(t)
	if status, body := e.series(t, 99999, e.patientID, "2030-01-02T03:00:00Z"); status != http.StatusNotFound || faultCode(t, body) != "UNKNOWN_DOCTOR" {
		t.Fatalf("unknown doctor: %d %v", status, body)
	}
	if status, body := e.series(t, e.doctorID, 99999, "2030-01-02T03:00:00Z"); status != http.StatusNotFound || faultCode(t, body) != "UNKNOWN_PATIENT" {
		t.Fatalf("unknown patient: %d %v", status, body)
	}
	if status, body := e.series(t, e.doctorID, e.patientID); status != http.StatusBadRequest || faultCode(t, body) != "INVALID_REQUEST" {
		t.Fatalf("empty series: %d %v", status, body)
	}
	if n := e.appointmentCount(t); n != 0 {
		t.Fatalf("want 0 stored appointments, got %d", n)
	}
}
