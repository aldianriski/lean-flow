import { describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'
import { mount } from '@vue/test-utils'

const lookup = vi.fn<(id: number) => Promise<void>>(async () => {})
const cancel = vi.fn<(id: number) => Promise<void>>(async () => {})
const data = ref<{ id: number; doctorId: number; patientId: number; slotStart: string } | null>(null)
vi.mock('../gateway/useAppointmentGateway', () => ({
  useAppointmentGateway: () => ({ data, fault: ref(null), cancelledId: ref(null), book: vi.fn(), cancel, lookup }),
}))

import CancelAppointment from './CancelAppointment.vue'

describe('CancelAppointment look-up', () => {
  it('looks the appointment up without cancelling it', async () => {
    const w = mount(CancelAppointment)
    await w.find('input[name=appointmentId]').setValue('42')
    await w.find('button[name=lookup]').trigger('click')
    expect(lookup).toHaveBeenCalledWith(42)
    expect(cancel).not.toHaveBeenCalled()
  })

  it('shows the doctor and patient of the appointment found', () => {
    data.value = { id: 42, doctorId: 7, patientId: 3, slotStart: '2030-01-02T03:00:00Z' }
    const text = mount(CancelAppointment).find('.found').text()
    expect(text).toContain('42')
    expect(text).toContain('doctor 7')
    expect(text).toContain('patient 3')
  })
})
