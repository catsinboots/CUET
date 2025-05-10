let colleges = []; // Will be loaded from JSON

function parseCutoff(cutoffStr) {
  if (!cutoffStr) return null;
  const match = cutoffStr.match(/\d+/);
  return match ? parseInt(match[0], 10) : null;
}

function renderTable(collegesList) {
  const tbody = document.getElementById('collegesBody');
  tbody.innerHTML = '';
  collegesList.forEach((college, idx) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><a href="#" onclick="showDetails(${idx});return false;">${college['College Name']}</a></td>
      <td>${college['Course Type']}</td>
      <td>${college['Specialization']}</td>
      <td>${college['Location (City, State)']}</td>
      <td>${college['2024 CUET-PG Cutoff (Gen)'] || ''}</td>
    `;
    tbody.appendChild(tr);
  });
  document.getElementById('collegesTable').style.display = collegesList.length ? '' : 'none';
}

function filterColleges() {
  const score = parseInt(document.getElementById('scoreInput').value, 10);
  if (isNaN(score)) {
    document.getElementById('collegesBody').innerHTML = '';
    document.getElementById('resultsCount').textContent = '';
    document.getElementById('collegesTable').style.display = 'none';
    return;
  }
  const filtered = colleges
    .filter(college =>
      college['Admission Process'] === "CUET-PG" &&
      parseCutoff(college['2024 CUET-PG Cutoff (Gen)']) !== null &&
      score >= parseCutoff(college['2024 CUET-PG Cutoff (Gen)'])
    )
    .sort((a, b) => parseCutoff(b['2024 CUET-PG Cutoff (Gen)']) - parseCutoff(a['2024 CUET-PG Cutoff (Gen)']));
  document.getElementById('resultsCount').textContent =
    `Showing ${filtered.length} colleges for CUET-PG score ${score}`;
  renderTable(filtered);
}

function showDetails(idx) {
  const score = parseInt(document.getElementById('scoreInput').value, 10);
  const filtered = colleges
    .filter(college =>
      college['Admission Process'] === "CUET-PG" &&
      parseCutoff(college['2024 CUET-PG Cutoff (Gen)']) !== null &&
      score >= parseCutoff(college['2024 CUET-PG Cutoff (Gen)'])
    )
    .sort((a, b) => parseCutoff(b['2024 CUET-PG Cutoff (Gen)']) - parseCutoff(a['2024 CUET-PG Cutoff (Gen)']));
  const college = filtered[idx];
  if (!college) return;
  let html = `<h2>${college['College Name']}</h2><ul>`;
  for (const key in college) {
    html += `<li><strong>${key}:</strong> ${college[key]}</li>`;
  }
  html += `</ul>`;
  document.getElementById('modalDetails').innerHTML = html;
  document.getElementById('modal').style.display = 'flex';
}
window.showDetails = showDetails;

document.getElementById('closeModal').onclick = function() {
  document.getElementById('modal').style.display = 'none';
};

document.getElementById('findBtn').onclick = filterColleges;

// Fetch the JSON data on page load
fetch('PG-Colleges.json')
  .then(response => response.json())
  .then(data => {
    colleges = data;
  })
  .catch(err => {
    alert('Failed to load college data!');
    console.error(err);
  });
