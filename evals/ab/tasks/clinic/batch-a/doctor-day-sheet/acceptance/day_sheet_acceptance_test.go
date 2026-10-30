package httpapi_test

import (
	"fmt"
	"net/http"
	"testing"
)

func appointmentSlots(t *testing.T, body map[string]any) []string {
	t.Helper()
	list, ok := body["appointments"].([]any)
	if !ok {
		t.Fatalf("appointments must be a JSON array, got %v", body)
	}
	out := make([]string, 0, len(list))
	for _, item := range list {
		a, ok := item.(map[string]any)
		if !ok || a["id"] == nil || a["doctorId"] == nil || a["patientId"] == nil {
			t.Fatalf("appointment must have the booking shape, got %v", item)
		}
		out = append(out, a["slotStart"].(string))
	}
	return out
}

func TestDoctorDaySheet(t *testing.T) {
	e := setup(t)
	exec(t, `INSERT INTO doctors(name, work_start, work_end) VALUES('Dr B','09:00','17:00')`)
	// Dr A (id 1): two bookings made through the API, out of chronological order.
	for _, slot := range []string{"2030-01-02T03:00:00Z", "2030-01-02T02:00:00Z", "2030-01-03T03:00:00Z"} {
		if status, body := e.book(t, e.doctorID, slot); status != http.StatusCreated {
			t.Fatalf("%s: %d %v", slot, status, body)
		}
	}
	// Rows straddling the clinic-local midnights of 2 Jan (17:00Z to 17:00Z), inserted directly.
	for _, slot := range []string{"2030-01-01T16:59:59Z", "2030-01-01T17:00:00Z", "2030-01-02T16:59:59Z", "2030-01-02T17:00:00Z"} {
		exec(t, `INSERT INTO appointments(doctor_id, patient_id, slot_start) VALUES($1,$2,$3)`, e.doctorID, e.patientID, slot)
	}
	// Another doctor's appointment on the same day must not leak in.
	exec(t, `INSERT INTO appointments(doctor_id, patient_id, slot_start) VALUES(2,$1,'2030-01-02T04:00:00Z')`, e.patientID)

	status, body := e.raw(t, http.MethodGet, fmt.Sprintf("/api/doctors/%d/appointments?date=2030-01-02", e.doctorID))
	if status != http.StatusOK {
		t.Fatalf("status %d body %v", status, body)
	}
	got := appointmentSlots(t, body)
	want := []string{"2030-01-01T17:00:00Z", "2030-01-02T02:00:00Z", "2030-01-02T03:00:00Z", "2030-01-02T16:59:59Z"}
	if fmt.Sprint(got) != fmt.Sprint(want) {
		t.Fatalf("clinic day 2 Jan for Dr A:\n got %v\nwant %v", got, want)
	}

	// A day with nothing booked is an empty list, not null.
	status, body = e.raw(t, http.MethodGet, fmt.Sprintf("/api/doctors/%d/appointments?date=2030-02-01", e.doctorID))
	if status != http.StatusOK || len(appointmentSlots(t, body)) != 0 {
		t.Fatalf("empty day: %d %v", status, body)
	}
}

func TestDoctorDaySheetRefusals(t *testing.T) {
	e := setup(t)
	cases := []struct {
		name, method, path, code string
		status                   int
	}{
		{"unknown doctor", http.MethodGet, "/api/doctors/99999/appointments?date=2030-01-02", "UNKNOWN_DOCTOR", http.StatusNotFound},
		{"missing date", http.MethodGet, fmt.Sprintf("/api/doctors/%d/appointments", e.doctorID), "INVALID_REQUEST", http.StatusBadRequest},
		{"malformed date", http.MethodGet, fmt.Sprintf("/api/doctors/%d/appointments?date=02-01-2030", e.doctorID), "INVALID_REQUEST", http.StatusBadRequest},
		{"impossible date", http.MethodGet, fmt.Sprintf("/api/doctors/%d/appointments?date=2030-02-30", e.doctorID), "INVALID_REQUEST", http.StatusBadRequest},
		{"non-numeric doctor id", http.MethodGet, "/api/doctors/abc/appointments?date=2030-01-02", "INVALID_REQUEST", http.StatusBadRequest},
		{"wrong method", http.MethodPost, fmt.Sprintf("/api/doctors/%d/appointments?date=2030-01-02", e.doctorID), "METHOD_NOT_ALLOWED", http.StatusMethodNotAllowed},
	}
	for _, c := range cases {
		t.Run(c.name, func(t *testing.T) {
			status, body := e.raw(t, c.method, c.path)
			if status != c.status || faultCode(t, body) != c.code {
				t.Fatalf("got %d %v, want %d %s", status, body, c.status, c.code)
			}
		})
	}
}
