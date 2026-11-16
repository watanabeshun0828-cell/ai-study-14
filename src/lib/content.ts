import { z } from 'zod'

const nonempty = z.string().trim().min(1)
export const courseSchema = z.object({
  schemaVersion: z.literal(1), id: nonempty, day: z.number().int().min(1).max(14),
  title: nonempty, subtitle: nonempty, minutes: z.number().int().positive(),
  objectives: z.array(nonempty).min(1),
  sections: z.array(z.object({
    id: nonempty, title: nonempty, paragraphs: z.array(nonempty).min(1),
    keyPoint: nonempty,
    diagram: z.object({ kind: z.enum(['nested', 'flow']).optional(), title: nonempty, items: z.array(z.object({ label: nonempty, detail: nonempty })).min(2) }).optional()
  })).min(1),
  questions: z.array(z.object({
    id: nonempty, category: nonempty, sectionId: nonempty, prompt: nonempty,
    choices: z.tuple([nonempty, nonempty, nonempty, nonempty]),
    correctIndex: z.number().int().min(0).max(3), explanation: nonempty
  })).min(1)
}).superRefine((course, ctx) => {
  const ids = course.sections.map(s => s.id)
  if (new Set(ids).size !== ids.length) ctx.addIssue({ code: 'custom', message: '章IDが重複しています' })
  const questions = course.questions.map(q => q.id)
  if (new Set(questions).size !== questions.length) ctx.addIssue({ code: 'custom', message: '問題IDが重複しています' })
  course.questions.forEach((q, index) => {
    if (!ids.includes(q.sectionId)) ctx.addIssue({ code: 'custom', path: ['questions', index, 'sectionId'], message: '対応する章がありません' })
    if (new Set(q.choices).size !== 4) ctx.addIssue({ code: 'custom', path: ['questions', index, 'choices'], message: '選択肢は重複できません' })
  })
})
export type Course = z.infer<typeof courseSchema>
export type Question = Course['questions'][number]

export function parseCourses(modules: Record<string, unknown>): Course[] {
  const courses = Object.values(modules).map(raw => courseSchema.parse(raw)).sort((a, b) => a.day - b.day)
  if (new Set(courses.map(c => c.day)).size !== courses.length) throw new Error('Day番号が重複しています')
  if (new Set(courses.map(c => c.id)).size !== courses.length) throw new Error('教材IDが重複しています')
  const sectionIds = courses.flatMap(c => c.sections.map(s => s.id))
  if (new Set(sectionIds).size !== sectionIds.length) throw new Error('章IDは全教材で一意にしてください')
  const questionIds = courses.flatMap(c => c.questions.map(q => q.id))
  if (new Set(questionIds).size !== questionIds.length) throw new Error('問題IDは全教材で一意にしてください')
  return courses
}
