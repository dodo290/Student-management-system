let teachers = [];

function saveToLocalStorage() {
  localStorage.setItem('teacherData', JSON.stringify(teachers));
}

function loadFromLocalStorage() {
  const data = localStorage.getItem('teacherData');
  if (data) {
    teachers = JSON.parse(data);
    renderTeachers();
  }
}

function addTeacher() {
  const name = document.getElementById('teacherName').value.trim();
  if (!name) return;

  teachers.push({ name, students: [] });
  saveToLocalStorage();
  renderTeachers();
  document.getElementById('teacherName').value = '';
}

function renderTeachers() {
  const container = document.getElementById('teacherList');
  container.innerHTML = '';

  teachers.forEach((teacher, tIndex) => {
    const div = document.createElement('div');
    div.className = 'teacher';
    div.innerHTML = `
      <h3>${teacher.name}'s Class</h3>
      <input type="text" placeholder="Student Name" class="studentName">
      <button onclick="addStudent(${tIndex}, this)">Add Student</button>
      <button onclick="editTeacher(${tIndex})">✏️ Edit Teacher</button>
      <button onclick="deleteTeacher(${tIndex})">🗑️ Delete Teacher</button>
      <table>
        <thead>
          <tr>
            <th>Student Name</th>
            <th>Paid</th>
            <th>Sessions</th>
            <th>Presence Dates</th>
            <th>Presence</th>
            <th>Payment</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${teacher.students.map((s, sIndex) => `
            <tr data-t="${tIndex}" data-s="${sIndex}">
              <td class="studentNameText">${s.name}</td>
              <td class="paid">${s.paid ? "Yes" : "No"}</td>
              <td class="sessions">${s.sessions}</td>
              <td class="dates">${s.dates.join(', ')}</td>
              <td><button onclick="markPresence(this)">✔️</button></td>
              <td><button onclick="markPaid(this)">Yes</button></td>
              <td class="actions">
                <button onclick="editStudent(this)">✏️</button>
                <button onclick="deleteStudent(this)">🗑️</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
    container.appendChild(div);
  });
}

function addStudent(tIndex, btn) {
  const input = btn.parentElement.querySelector('.studentName');
  const name = input.value.trim();
  if (!name) return;

  teachers[tIndex].students.push({
    name,
    paid: false,
    sessions: 0,
    dates: []
  });

  saveToLocalStorage();
  renderTeachers();
}

function markPresence(button) {
  const row = button.closest('tr');
  const tIndex = row.dataset.t;
  const sIndex = row.dataset.s;

  const student = teachers[tIndex].students[sIndex];
  const today = new Date().toISOString().split('T')[0];
  student.sessions += 1;
  student.dates.push(today);

  if (student.sessions >= 4) {
    student.sessions = 0;
    student.dates = [];
    student.paid = false;
  }

  saveToLocalStorage();
  renderTeachers();
}

function markPaid(button) {
  const row = button.closest('tr');
  const tIndex = row.dataset.t;
  const sIndex = row.dataset.s;

  teachers[tIndex].students[sIndex].paid = true;
  saveToLocalStorage();
  renderTeachers();
}

function editStudent(button) {
  const row = button.closest('tr');
  const tIndex = row.dataset.t;
  const sIndex = row.dataset.s;

  const currentName = teachers[tIndex].students[sIndex].name;
  const newName = prompt("Edit student name:", currentName);
  if (newName) {
    teachers[tIndex].students[sIndex].name = newName;
    saveToLocalStorage();
    renderTeachers();
  }
}

function deleteStudent(button) {
  const row = button.closest('tr');
  const tIndex = row.dataset.t;
  const sIndex = row.dataset.s;

  if (confirm("Are you sure you want to delete this student?")) {
    teachers[tIndex].students.splice(sIndex, 1);
    saveToLocalStorage();
    renderTeachers();
  }
}

function editTeacher(tIndex) {
  const currentName = teachers[tIndex].name;
  const newName = prompt("Edit teacher name:", currentName);
  if (newName) {
    teachers[tIndex].name = newName;
    saveToLocalStorage();
    renderTeachers();
  }
}

function deleteTeacher(tIndex) {
  if (confirm("Are you sure you want to delete this teacher and all their students?")) {
    teachers.splice(tIndex, 1);
    saveToLocalStorage();
    renderTeachers();
  }
}

// Load saved data
loadFromLocalStorage();