package httpapi_test

import (
	"net/http"
	"testing"
)

func TestClosedOnIndependenceDay(t *testing.T) {
	e := setup(t)
	// A doctor whose hours span most of the clinic-local day, so only the date decides.
	exec(t, `UPDATE doctors SET work_start='05:00', work_end='23:00' WHERE id=$1`, e.doctorID)
	cases := []struct {
		name string
		slot string
		ok   bool
	}{
		{"evening before, local", "2030-08-16T15:00:00Z", true},
		{"17 Aug morning local, still 16 Aug in UTC", "2030-08-16T23:00:00Z", false},
		{"17 Aug midday local", "2030-08-17T03:00:00Z", false},
		{"17 Aug late evening local", "2030-08-17T15:00:00Z", false},
		{"18 Aug morning local, still 17 Aug in UTC", "2030-08-17T23:00:00Z", true},
		{"18 Aug midday local", "2030-08-18T03:00:00Z", true},
		{"every year, not just 2030", "2031-08-17T03:00:00Z", false},
		{"other August day", "2031-08-16T03:00:00Z", true},
	}
	for _, c := range cases {
		t.Run(c.name, func(t *testing.T) {
			status, body := e.book(t, e.doctorID, c.slot)
			if c.ok {
				if status != http.StatusCreated {
					t.Fatalf("%s must be bookable: %d %v", c.slot, status, body)
				}
				return
			}
			if status != http.StatusUnprocessableEntity || faultCode(t, body) != "OUTSIDE_WORKING_HOURS" {
				t.Fatalf("%s must be refused as outside working hours: %d %v", c.slot, status, body)
			}
		})
	}
}
