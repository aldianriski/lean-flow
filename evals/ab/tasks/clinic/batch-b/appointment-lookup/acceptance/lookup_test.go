package httpapi_test

import (
	"fmt"
	"net/http"
	"testing"
)

func TestGetAppointment(t *testing.T) {
	e := setup(t)
	id := e.insertAppointment(t, "2030-01-05T03:00:00Z")
	status, body := e.raw(t, http.MethodGet, "/api/appointments/"+fmt.Sprint(id))
	if status != http.StatusOK {
		t.Fatalf("status %d body %v", status, body)
	}
	appt, ok := body["appointment"].(map[string]any)
	if !ok || int64(appt["id"].(float64)) != id || int64(appt["doctorId"].(float64)) != e.doctorID || int64(appt["patientId"].(float64)) != e.patientID {
		t.Fatalf("unexpected body %v", body)
	}
	if n := e.appointmentCount(t); n != 1 {
		t.Fatalf("a lookup must not change anything, rows = %d", n)
	}
}

func TestGetAppointmentRefusals(t *testing.T) {
	e := setup(t)
	status, body := e.raw(t, http.MethodGet, "/api/appointments/99999")
	if status != http.StatusNotFound || faultCode(t, body) != "UNKNOWN_APPOINTMENT" {
		t.Fatalf("unknown: %d %v", status, body)
	}
	status, body = e.raw(t, http.MethodGet, "/api/appointments/abc")
	if status != http.StatusBadRequest || faultCode(t, body) != "INVALID_REQUEST" {
		t.Fatalf("bad id: %d %v", status, body)
	}
	status, body = e.raw(t, http.MethodDelete, "/api/appointments/1")
	if status != http.StatusMethodNotAllowed || faultCode(t, body) != "METHOD_NOT_ALLOWED" {
		t.Fatalf("wrong method: %d %v", status, body)
	}
}
