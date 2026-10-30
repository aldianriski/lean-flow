package clinic_test

import (
	"os"
	"strings"
	"testing"
	"time"

	"clinic/internal/clinic"
)

func TestOffsetFromMidnight(t *testing.T) {
	cases := []struct {
		at   time.Time
		want time.Duration
	}{
		{time.Date(2030, 1, 2, 0, 0, 0, 0, time.UTC), 0},
		{time.Date(2030, 1, 2, 9, 0, 0, 0, time.UTC), 9 * time.Hour},
		{time.Date(2030, 1, 2, 16, 59, 59, 999_000_000, time.UTC), 16*time.Hour + 59*time.Minute + 59*time.Second + 999*time.Millisecond},
		{time.Date(2030, 7, 3, 23, 30, 15, 0, clinic.Zone), 23*time.Hour + 30*time.Minute + 15*time.Second},
	}
	for _, c := range cases {
		if got := clinic.OffsetFromMidnight(c.at); got != c.want {
			t.Errorf("OffsetFromMidnight(%v) = %v, want %v", c.at, got, c.want)
		}
	}
}

// Both former copies of the computation must go through the one helper.
func TestWallClockOffsetIsWrittenOnce(t *testing.T) {
	for _, path := range []string{"../rules/hours.go", "../store/doctors.go"} {
		raw, err := os.ReadFile(path)
		if err != nil {
			t.Fatal(err)
		}
		src := string(raw)
		if !strings.Contains(src, "clinic.OffsetFromMidnight(") {
			t.Errorf("%s does not call clinic.OffsetFromMidnight", path)
		}
		if strings.Contains(src, ".Hour()") || strings.Contains(src, "func offset(") {
			t.Errorf("%s still carries its own wall-clock offset arithmetic", path)
		}
	}
}
