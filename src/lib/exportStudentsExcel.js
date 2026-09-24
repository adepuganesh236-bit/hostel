import ExcelJS from 'exceljs'
import { HEADERS, COL_WIDTHS, buildStudentRows, columnLetter } from './exportStudents.js'

// 1-based column index of "Monthly Budget (₹)" for number formatting.
const BUDGET_COLUMN = 14

export function buildStudentsWorkbook(students) {
  const wb = new ExcelJS.Workbook()
  const ws = wb.addWorksheet('Registered Students', {
    views: [{ state: 'frozen', ySplit: 1 }],
  })

  ws.columns = COL_WIDTHS.map((width, i) => ({
    header: HEADERS[i],
    key: `col${i}`,
    width,
  }))

  for (const data of buildStudentRows(students)) ws.addRow(data)

  const headerRow = ws.getRow(1)
  headerRow.height = 22
  headerRow.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' } }
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1D4ED8' } }
    cell.alignment = { horizontal: 'center', vertical: 'middle' }
  })

  for (let r = 2; r <= ws.rowCount; r += 1) {
    const cell = ws.getCell(r, BUDGET_COLUMN)
    if (typeof cell.value === 'number') {
      cell.numFmt = '#,##0'
      cell.alignment = { horizontal: 'right' }
    }
  }

  ws.autoFilter = { from: 'A1', to: `${columnLetter(HEADERS.length)}1` }
  return wb
}

export async function exportStudentsExcel(students, { fileName } = {}) {
  const wb = buildStudentsWorkbook(students)
  const name = fileName || `registered-students-${new Date().toISOString().slice(0, 10)}.xlsx`
  const buffer = await wb.xlsx.writeBuffer()
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = name
  document.body.appendChild(anchor)
  anchor.click()
  document.body.removeChild(anchor)
  URL.revokeObjectURL(url)
  return name
}