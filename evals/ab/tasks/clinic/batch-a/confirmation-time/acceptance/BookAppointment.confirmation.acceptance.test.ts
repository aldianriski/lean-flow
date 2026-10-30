import { describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'
import { mount } from '@vue/test-utils'

const data = ref<{ id: number; doctorId: number; patientId: number; slotStart: string } | null>(null)
vi.mock('../gateway/useAppointmentGateway', () => ({
  useAppointmentGateway: () => ({ data, fault: ref(null), book: vi.fn() }),
}))

import BookAppointment from './BookAppointment.vue'

// The confirmation must read the same on every staff machine, whatever zone its browser runs in.
describe.each(['America/New_York', 'Pacific/Auckland', 'UTC'])('confirmation time with the browser in %s', (zone) => {
  it.each([
    ['2030-01-02T03:00:00.000Z', '2030-01-02 10:00'],
    ['2030-01-02T18:30:00Z', '2030-01-03 01:30'],
  ])('shows %s as %s', (iso, expected) => {
    process.env.TZ = zone
    data.value = { id: 12, doctorId: 1, patientId: 1, slotStart: iso }
    const w = mount(BookAppointment)
    const text = w.find('.booked').text()
    expect(text).toContain('12')
    expect(text).toContain(expected)
    expect(text).not.toContain(iso)
  })
})
