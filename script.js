document.addEventListener('DOMContentLoaded', () => {

    // --- State Aplikasi (Tetap sama) ---
    let daftarPR = JSON.parse(localStorage.getItem('daftarPR')) || [];
    let daftarBuku = JSON.parse(localStorage.getItem('daftarBuku')) || [];

    // --- Fungsi Penyimpanan (Tetap sama) ---
    const simpanPRKeLocalStorage = () => localStorage.setItem('daftarPR', JSON.stringify(daftarPR));
    const simpanBukuKeLocalStorage = () => localStorage.setItem('daftarBuku', JSON.stringify(daftarBuku));

    // =======================================================
    // LOGIKA UNTUK HALAMAN PR (pr.html)
    // =======================================================
    const formPR = document.getElementById('form-pr');
    if (formPR) {
        const mapelInput = document.getElementById('mapel-input');
        const tugasInput = document.getElementById('tugas-input');
        const tenggatInput = document.getElementById('tenggat-input');
        const listPR = document.getElementById('list-pr');

        const renderPR = () => {
            listPR.innerHTML = '';
            if (daftarPR.length === 0) {
                listPR.innerHTML = '<p class="empty-state">Hore! Tidak ada PR.</p>';
                return;
            }
            daftarPR.sort((a, b) => new Date(a.tenggat) - new Date(b.tenggat));
            daftarPR.forEach(pr => {
                const itemPR = document.createElement('li');
                itemPR.className = `pr-item ${pr.selesai ? 'selesai' : ''}`;
                itemPR.dataset.id = pr.id;
                const tenggatFormatted = new Date(pr.tenggat).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
                itemPR.innerHTML = `
                    <input type="checkbox" class="checkbox" ${pr.selesai ? 'checked' : ''}>
                    <div class="info">
                        <h4>${pr.mapel}</h4>
                        <p class="deskripsi">${pr.tugas}</p>
                        <span class="tenggat">Tenggat: ${tenggatFormatted}</span>
                    </div>
                    <div class="aksi">
                        <button class="btn-hapus"><i class="fas fa-trash-alt"></i></button>
                    </div>
                `;
                listPR.appendChild(itemPR);
            });
        };

        const tambahPR = (e) => {
            e.preventDefault();
            daftarPR.push({
                id: Date.now(),
                mapel: mapelInput.value.trim(),
                tugas: tugasInput.value.trim(),
                tenggat: tenggatInput.value,
                selesai: false
            });
            simpanPRKeLocalStorage();
            renderPR();
            formPR.reset();
            mapelInput.focus();
        };

        const handleAksiPR = (e) => {
            const item = e.target.closest('.pr-item');
            if (!item) return;
            const prId = Number(item.dataset.id);
            if (e.target.matches('.checkbox')) {
                const index = daftarPR.findIndex(pr => pr.id === prId);
                if (index > -1) {
                    daftarPR[index].selesai = !daftarPR[index].selesai;
                    simpanPRKeLocalStorage();
                    renderPR();
                }
            }
            if (e.target.matches('.btn-hapus, .btn-hapus *')) {
                if (confirm('Yakin ingin menghapus PR ini?')) {
                    daftarPR = daftarPR.filter(pr => pr.id !== prId);
                    simpanPRKeLocalStorage();
                    renderPR();
                }
            }
        };

        formPR.addEventListener('submit', tambahPR);
        listPR.addEventListener('click', handleAksiPR);
        renderPR(); // Render saat halaman dimuat
    }

    // =======================================================
    // LOGIKA UNTUK HALAMAN BUKU (buku.html)
    // =======================================================
    const formBuku = document.getElementById('form-buku');
    if (formBuku) {
        const mapelBukuInput = document.getElementById('mapel-buku-input');
        const namaBukuInput = document.getElementById('nama-buku-input');
        const listBuku = document.getElementById('list-buku');

        const renderBuku = () => {
            listBuku.innerHTML = '';
            if (daftarBuku.length === 0) {
                listBuku.innerHTML = '<p class="empty-state">Tidak ada buku yang sedang dikumpulkan.</p>';
                return;
            }
            daftarBuku.forEach(buku => {
                const itemBuku = document.createElement('li');
                itemBuku.className = `buku-item ${buku.kembali ? 'kembali' : ''}`;
                itemBuku.dataset.id = buku.id;
                itemBuku.innerHTML = `
                    <div class="info">
                        <h4>${buku.mapel}</h4>
                        <p class="deskripsi">${buku.nama}</p>
                    </div>
                    <div class="aksi">
                        <button class="btn-kembali">${buku.kembali ? 'Terkumpul' : 'Kembali'}</button>
                        <button class="btn-hapus"><i class="fas fa-trash-alt"></i></button>
                    </div>
                `;
                listBuku.appendChild(itemBuku);
            });
        };

        const tambahBuku = (e) => {
            e.preventDefault();
            daftarBuku.push({
                id: Date.now(),
                mapel: mapelBukuInput.value.trim(),
                nama: namaBukuInput.value.trim(),
                kembali: false
            });
            simpanBukuKeLocalStorage();
            renderBuku();
            formBuku.reset();
            mapelBukuInput.focus();
        };

        const handleAksiBuku = (e) => {
            const item = e.target.closest('.buku-item');
            if (!item) return;
            const bukuId = Number(item.dataset.id);
            if (e.target.matches('.btn-kembali')) {
                const index = daftarBuku.findIndex(buku => buku.id === bukuId);
                if (index > -1) {
                    daftarBuku[index].kembali = !daftarBuku[index].kembali;
                    simpanBukuKeLocalStorage();
                    renderBuku();
                }
            }
            if (e.target.matches('.btn-hapus, .btn-hapus *')) {
                if (confirm('Yakin ingin menghapus data buku ini?')) {
                    daftarBuku = daftarBuku.filter(buku => buku.id !== bukuId);
                    simpanBukuKeLocalStorage();
                    renderBuku();
                }
            }
        };

        formBuku.addEventListener('submit', tambahBuku);
        listBuku.addEventListener('click', handleAksiBuku);
        renderBuku(); // Render saat halaman dimuat
    }
});