import { describe, expect, it } from 'vitest'
import raw from '../data/day01.json'
import { courseSchema, parseCourses } from './content'
describe('教材の入力検証', () => {
  it('Day1の4章・8問を取り込める', () => {
    const course = courseSchema.parse(raw)
    expect(course.sections).toHaveLength(4)
    expect(course.questions).toHaveLength(8)
  })
  it('正解が4択の範囲外なら拒否する', () => {
    const copy = structuredClone(raw); copy.questions[0].correctIndex = 4
    expect(() => courseSchema.parse(copy)).toThrow()
  })
  it('存在しない章参照と重複選択肢を拒否する', () => {
    const copy = structuredClone(raw); copy.questions[0].sectionId = 'missing'
    expect(() => courseSchema.parse(copy)).toThrow()
    copy.questions[0].sectionId = raw.questions[0].sectionId
    copy.questions[0].choices[1] = copy.questions[0].choices[0]
    expect(() => courseSchema.parse(copy)).toThrow()
  })
  it('問題IDの教材間重複を拒否する', () => {
    const day2 = { ...structuredClone(raw), id: 'day02', day: 2, sections: raw.sections.map(s => ({ ...s, id: 'new-' + s.id })), questions: raw.questions.map(q => ({ ...q, sectionId: 'new-' + q.sectionId })) }
    expect(() => parseCourses({ a: raw, b: day2 })).toThrow('問題ID')
  })
  it('同一日の二重登録を拒否する', () => expect(() => parseCourses({ a: raw, b: raw })).toThrow('Day番号'))
})
