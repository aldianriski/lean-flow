package httpapi_test

import (
	"fmt"
	"net/http"
	"testing"
)

// The fixed clock in setup is 2030-01-01T00:00:00Z. The doctor works nearly all day so that only the lead-time rule can refuse these slots.
func TestBookingLeadTime(t *testing.T) {
	e := setup(t)
	exec(t, `UPDATE doctors SET work_start='00:00', work_end='23:30' WHERE id=$1`, e.doctorID)
	cases := []struct {
		name string
		slot string
		ok   bool
	}{
		{"exactly 2h ahead is bookable", "2030-01-01T02:00:00Z", true},
		{"2h minus one second is refused", "2030-01-01T01:59:59Z", false},
		{"30 minutes ahead is refused", "2030-01-01T00:30:00Z", false},
		{"a slot already started is refused", "2029-12-31T10:00:00Z", false},
		{"well ahead is bookable", "2030-01-01T03:00:00Z", true},
	}
	for _, c := range cases {
		t.Run(c.name, func(t *testing.T) {
			status, body := e.book(t, e.doctorID, c.slot)
			if c.ok {
				if status != http.StatusCreated {
					t.Fatalf("want 201, got %d %v", status, body)
				}
				return
			}
			if status != http.StatusUnprocessableEntity || faultCode(t, body) != "SLOT_TOO_SOON" {
				t.Fatalf("want 422 SLOT_TOO_SOON, got %d %v", status, body)
			}
		})
	}
}

// Cancelling is not subject to the booking lead time.
func TestLeadTimeDoesNotAffectCancelling(t *testing.T) {
	e := setup(t)
	id := e.insertAppointment(t, "2030-01-05T03:00:00Z")
	if status, body := e.cancel(t, fmt.Sprint(id)); status != http.StatusNoContent {
		t.Fatalf("cancel: %d %v", status, body)
	}
}
