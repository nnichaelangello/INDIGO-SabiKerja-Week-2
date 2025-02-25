// Filter jobs
function filterJobs() {
  const searchQuery = document.getElementById('searchInput').value.toLowerCase();
  const department = document.getElementById('departmentFilter').value.toLowerCase();
  const location = document.getElementById('locationFilter').value.toLowerCase();
  const jobCards = document.getElementsByClassName('job-card');

  for (let job of jobCards) {
      const title = job.getElementsByClassName('job-title')[0].textContent.toLowerCase();
      const jobLocation = job.dataset.location.toLowerCase();
      const jobDepartment = job.dataset.department.toLowerCase();

      const matchesSearch = title.includes(searchQuery);
      const matchesDepartment = !department || jobDepartment === department;
      const matchesLocation = !location || jobLocation === location;

      // Tambahkan kelas 'hidden' untuk menyembunyikan, bukan ubah display langsung
      job.classList.toggle('hidden', !(matchesSearch && matchesDepartment && matchesLocation));
  }
  resetPagination();
}

// Pagination
let currentPage = 1;
const itemsPerPage = 3;

function updatePagination() {
  const jobCards = Array.from(document.getElementsByClassName('job-card'));
  const visibleJobs = jobCards.filter(job => !job.classList.contains('hidden'));
  const totalPages = Math.ceil(visibleJobs.length / itemsPerPage) || 1; // Minimal 1 halaman
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;

  // Tampilkan atau sembunyikan job berdasarkan halaman
  jobCards.forEach((job, index) => {
      const isVisible = !job.classList.contains('hidden');
      const isInPageRange = index >= start && index < end;
      job.style.display = isVisible && isInPageRange ? 'block' : 'none';
  });

  // Jika tidak ada pekerjaan yang cocok, tampilkan pesan tanpa menghapus DOM
  const jobListings = document.getElementById('jobListings');
  if (visibleJobs.length === 0) {
      jobListings.innerHTML = '<p>No jobs found matching your criteria.</p>';
      document.getElementById('pagination').style.display = 'none';
  } else if (jobListings.children[0].tagName === 'P') {
      // Pulihkan job cards jika sebelumnya diganti dengan pesan
      jobListings.innerHTML = '';
      jobCards.forEach(job => jobListings.appendChild(job));
  }

  // Update tombol pagination
  const pageNumbers = document.getElementById('pageNumbers');
  pageNumbers.innerHTML = '';
  for (let i = 1; i <= totalPages; i++) {
      const button = document.createElement('button');
      button.textContent = i;
      button.classList.add('page-number');
      if (i === currentPage) button.classList.add('active');
      button.onclick = () => goToPage(i);
      pageNumbers.appendChild(button);
  }

  // Kontrol tombol navigasi
  const navButtons = document.querySelectorAll('.nav-btn');
  navButtons.forEach(btn => {
      btn.disabled = false;
      if (btn.textContent === '«' || btn.textContent === '<') btn.disabled = currentPage === 1;
      if (btn.textContent === '>' || btn.textContent === '»') btn.disabled = currentPage === totalPages;
  });

  document.getElementById('pagination').style.display = visibleJobs.length > itemsPerPage ? 'flex' : 'none';
}

function goToPage(page) {
  currentPage = page;
  updatePagination();
}

function prevPage() {
  if (currentPage > 1) {
      currentPage--;
      updatePagination();
  }
}

function nextPage() {
  const jobCards = Array.from(document.getElementsByClassName('job-card'));
  const visibleJobs = jobCards.filter(job => !job.classList.contains('hidden'));
  const totalPages = Math.ceil(visibleJobs.length / itemsPerPage) || 1;
  if (currentPage < totalPages) {
      currentPage++;
      updatePagination();
  }
}

function resetPagination() {
  currentPage = 1;
  updatePagination();
}

// Modal untuk Apply (tanpa perubahan)
function showApplyModal(jobTitle) {
  const modal = document.getElementById('applyModal');
  const modalJobTitle = document.getElementById('modalJobTitle');
  modalJobTitle.textContent = jobTitle;
  modal.style.display = 'block';
  document.body.style.overflow = 'hidden';
}

function closeApplyModal() {
  const modal = document.getElementById('applyModal');
  modal.style.display = 'none';
  document.body.style.overflow = 'auto';
  document.getElementById('applyForm').reset();
}

// Form submission (tanpa perubahan)
document.getElementById('applyForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const cv = document.getElementById('cv').files[0];

  if (name && email && cv) {
      if (cv.type !== 'application/pdf') {
          alert('Please upload a PDF file for your CV.');
          return;
      }
      alert(`Application submitted for ${document.getElementById('modalJobTitle').textContent}\nName: ${name}\nEmail: ${email}`);
      closeApplyModal();
  } else {
      alert('Please fill in all fields and upload a CV.');
  }
});

// Initialize
window.onload = function() {
  updatePagination();
  document.getElementById('searchInput').addEventListener('input', filterJobs);
  document.getElementById('departmentFilter').addEventListener('change', filterJobs);
  document.getElementById('locationFilter').addEventListener('change', filterJobs);

  document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && document.getElementById('applyModal').style.display === 'block') {
          closeApplyModal();
      }
  });
};