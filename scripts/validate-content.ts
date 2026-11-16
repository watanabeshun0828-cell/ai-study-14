import { readdir, readFile } from 'node:fs/promises'
import { parseCourses } from '../src/lib/content.ts'

const dir = new URL('../src/data/', import.meta.url)
const files = (await readdir(dir)).filter(f => /^day.*\.json$/.test(f))
const modules = Object.fromEntries(await Promise.all(files.map(async f => [f, JSON.parse(await readFile(new URL(f, dir), 'utf8'))])))
const courses = parseCourses(modules)
console.log(`教材検証 OK: ${courses.length}日分 / ${courses.reduce((n, c) => n + c.sections.length, 0)}章 / ${courses.reduce((n, c) => n + c.questions.length, 0)}問`)
