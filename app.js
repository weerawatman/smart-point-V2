// ===========================
// Supabase Configuration
// ===========================
const SUPABASE_URL = 'https://ynywmrupnuiasomqlndh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlueXdtcnVwbnVpYXNvbXFsbmRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2NjMzNzgsImV4cCI6MjA4NTIzOTM3OH0.qoz5BuA_RL5sStGtZl33uV6n4Nxie1AwC0GHOiZ5V4w';

// Initialize Supabase client (check if not already initialized)
let supabase;
if (typeof window.supabase !== 'undefined' && !supabase) {
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log('✅ Supabase client initialized');
} else if (!supabase) {
    console.error('❌ Supabase library not loaded');
}

// ===========================
// Application State
// ===========================
const APP_STATE = {
    currentUser: null,
    currentView: 'dashboard',
    employees: [],
    rewards: [],
    allocations: [],
    transactions: []
};

// SMART Culture Values
const SMART_VALUES = {
    S: {
        name: 'Spirit of Commitment, Integrity & Ethics',
        desc: 'การปฏิบัติหน้าที่ด้วยความซื่อสัตย์และส่งมอบงานตามข้อตกลงหรือสัญญาที่ได้ตกลงกันไว้ ด้วยความโปร่งใส'
    },
    M: {
        name: 'Mastery of Learning & Applying Technology',
        desc: 'การตั้งใจเรียนรู้สิ่งใหม่ๆ รวมถึงเทคโนโลยี และนำมาใช้ปรับปรุง พัฒนา การทำงาน บริการ หรือผลิตภัณฑ์ ให้ดีขึ้นอย่างต่อเนื่อง'
    },
    A: {
        name: 'Agility',
        desc: 'การเปิดรับสิ่งใหม่ วางแผนปรับตัว เตรียมความพร้อมสำหรับการเปลี่ยนแปลงอย่างรวดเร็ว'
    },
    R: {
        name: 'Respect Others & Value Diversity',
        desc: 'การยอมรับความแตกต่าง และเปิดใจรับฟังความคิดเห็นของทุกคนในทีมเพื่อหาแนวทางที่ดีที่สุดในการแก้ไขปัญหา'
    },
    T: {
        name: 'Think Customers & Think Value',
        desc: 'การทำความเข้าใจความคาดหวังของลูกค้า (ทั้งภายในและภายนอก) อย่างต่อเนื่อง และใส่ใจในคุณค่าของงานและบริการที่ส่งมอบให้ลูกค้า'
    }
};

// ===========================
// Initialize Data from Supabase
// ===========================
async function initializeDemoData() {
    console.log('🔄 Loading data from Supabase...');
    console.log('📡 Supabase URL:', SUPABASE_URL);

    try {
        // Test connection first
        console.log('Testing Supabase connection...');

        // Fetch users with timeout
        const { data: users, error: usersError } = await supabase
            .from('users')
            .select('*');

        if (usersError) {
            console.error('❌ Users error:', usersError);
            throw new Error(`Failed to load users: ${usersError.message}`);
        }

        if (!users || users.length === 0) {
            throw new Error('No users found in database. Please run the SQL script to insert demo data.');
        }

        APP_STATE.users = users;
        console.log('✅ Loaded users:', users.length, 'users');

        // Fetch employees with user names
        const { data: employees, error: employeesError } = await supabase
            .from('employees')
            .select(`
                *,
                users!employees_employee_id_fkey (
                    name,
                    avatar,
                    role
                )
            `);

        if (employeesError) throw employeesError;

        // Flatten the data structure
        APP_STATE.employees = employees.map(emp => ({
            ...emp,
            name: emp.users?.name,
            avatar: emp.users?.avatar,
            role: emp.users?.role
        }));
        console.log('✅ Loaded employees:', APP_STATE.employees);

        // Fetch allocations
        const { data: allocations, error: allocationsError } = await supabase
            .from('allocations')
            .select('*')
            .order('created_at', { ascending: false });

        if (allocationsError) throw allocationsError;
        APP_STATE.allocations = allocations || [];
        console.log('✅ Loaded allocations:', allocations?.length || 0);

        // Fetch transactions
        const { data: transactions, error: transactionsError } = await supabase
            .from('transactions')
            .select('*')
            .order('created_at', { ascending: false });

        if (transactionsError) throw transactionsError;
        APP_STATE.transactions = transactions || [];
        console.log('✅ Loaded transactions:', transactions?.length || 0);

        console.log('✅ All data loaded from Supabase successfully!');

        // Hide loading indicator and show login form
        const loadingDiv = document.getElementById('loadingIndicator');
        const loginForm = document.getElementById('loginForm');
        if (loadingDiv) loadingDiv.style.display = 'none';
        if (loginForm) loginForm.style.display = 'block';

    } catch (error) {
        console.error('❌ Error loading data from Supabase:', error);

        // Hide loading indicator and show error
        const loadingDiv = document.getElementById('loadingIndicator');
        if (loadingDiv) {
            loadingDiv.innerHTML = `
                <div style="color: #ef4444; padding: 20px;">
                    <div style="font-size: 48px; margin-bottom: 10px;">❌</div>
                    <div style="font-size: 18px; font-weight: 600; margin-bottom: 10px;">เกิดข้อผิดพลาด</div>
                    <div style="font-size: 14px; opacity: 0.8;">${error.message}</div>
                    <div style="margin-top: 20px; font-size: 12px; opacity: 0.6;">
                        กรุณาตรวจสอบ Console (F12) สำหรับรายละเอียดเพิ่มเติม
                    </div>
                </div>
            `;
        }
    }

    // Demo Rewards
    APP_STATE.rewards = [
        {
            id: 'r1',
            name: 'หูฟังบลูทูธ Premium',
            desc: 'หูฟังไร้สายคุณภาพสูง เสียงใส ตัดเสียงรบกวน',
            points: 150,
            category: 'electronics',
            image: '🎧'
        },
        {
            id: 'r2',
            name: 'บัตรกำนัล Starbucks 500 บาท',
            desc: 'บัตรกำนัลสตาร์บัคส์ มูลค่า 500 บาท',
            points: 50,
            category: 'giftcard',
            image: '☕'
        },
        {
            id: 'r3',
            name: 'Smart Watch',
            desc: 'นาฬิกาอัจฉริยะ ติดตามสุขภาพ ออกกำลังกาย',
            points: 300,
            category: 'electronics',
            image: '⌚'
        },
        {
            id: 'r4',
            name: 'คอร์สออนไลน์ Udemy',
            desc: 'เลือกคอร์สเรียนออนไลน์ได้ 1 คอร์ส',
            points: 80,
            category: 'experience',
            image: '📚'
        },
        {
            id: 'r5',
            name: 'กระเป๋าเป้แบรนด์เนม',
            desc: 'กระเป๋าเป้สุดเท่ ใส่โน้ตบุ๊คได้',
            points: 200,
            category: 'lifestyle',
            image: '🎒'
        },
        {
            id: 'r6',
            name: 'บัตรชมภาพยนตร์ 2 ที่นั่ง',
            desc: 'บัตรชมหนังฟรี 2 ที่นั่ง ทุกโรงในเครือ',
            points: 60,
            category: 'experience',
            image: '🎬'
        },
        {
            id: 'r7',
            name: 'Power Bank 20000mAh',
            desc: 'แบตสำรอง ชาร์จเร็ว รองรับทุกอุปกรณ์',
            points: 100,
            category: 'electronics',
            image: '🔋'
        },
        {
            id: 'r8',
            name: 'บัตรกำนัล Central 1000 บาท',
            desc: 'บัตรกำนัลห้างเซ็นทรัล มูลค่า 1000 บาท',
            points: 100,
            category: 'giftcard',
            image: '🎁'
        }
    ];

    // Note: We no longer use localStorage to ensure data is always synced from Supabase
}

// ===========================
// Authentication
// ===========================
function handleLogin(e) {
    e.preventDefault();

    const employeeId = document.getElementById('employeeId').value.trim();
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('loginError');

    // Find user from loaded data
    const user = APP_STATE.users.find(u => u.employee_id === employeeId && u.password === password);

    if (!user) {
        errorDiv.textContent = '❌ รหัสพนักงานหรือรหัสผ่านไม่ถูกต้อง';
        errorDiv.style.display = 'block';
        return;
    }

    APP_STATE.currentUser = user;

    document.getElementById('loginModal').classList.remove('active');
    document.getElementById('appContainer').classList.remove('hidden');

    updateUserInfo();
    showManagerFeatures();
    switchView('dashboard');
}

function logout() {
    APP_STATE.currentUser = null;
    document.getElementById('loginModal').classList.add('active');
    document.getElementById('appContainer').classList.add('hidden');
}

function updateUserInfo() {
    const user = APP_STATE.currentUser;
    document.getElementById('userName').textContent = user.name;
    const roleLabel = user.role === 'admin'
        ? 'Admin'
        : user.role === 'manager'
            ? 'Manager'
            : 'Employee';
    document.getElementById('userRole').textContent = roleLabel;
    document.getElementById('userAvatar').textContent = user.avatar;
}

function canAllocatePoints(user) {
    return user?.role === 'manager' || user?.role === 'admin';
}

function showManagerFeatures() {
    const managerElements = document.querySelectorAll('.manager-only');
    const isManager = canAllocatePoints(APP_STATE.currentUser);

    managerElements.forEach(el => {
        el.style.display = isManager ? '' : 'none';
    });
}

// ===========================
// Navigation
// ===========================
function switchView(viewName) {
    APP_STATE.currentView = viewName;

    // Update nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.view === viewName) {
            btn.classList.add('active');
        }
    });

    // Update views
    document.querySelectorAll('.view').forEach(view => {
        view.classList.remove('active');
    });
    document.getElementById(viewName + 'View').classList.add('active');

    // Load view data
    if (viewName === 'dashboard') {
        updateDashboard();
    } else if (viewName === 'rewards') {
        renderRewards();
    } else if (viewName === 'allocate') {
        renderAllocationForm();
    } else if (viewName === 'history') {
        renderHistory();
    }
}

// Setup navigation and login
document.addEventListener('DOMContentLoaded', async () => {
    // Initialize data from Supabase
    await initializeDemoData();

    // Setup login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            switchView(btn.dataset.view);
        });
    });
});

// ===========================
// Dashboard
// ===========================
function updateDashboard() {
    const user = APP_STATE.currentUser;

    const employeeRecord = findEmployeeRecord(user?.employee_id);

    if (user.role === 'employee' || employeeRecord) {
        const employee = employeeRecord;
        if (employee) {
            document.getElementById('currentPoints').textContent = employee.points;
            document.getElementById('totalEarned').textContent = employee.total_earned ?? employee.totalEarned ?? 0;

            // Update tier
            const tierBadge = document.getElementById('tierBadge');
            const tierInfo = getTierInfo(employee.total_earned ?? employee.totalEarned ?? 0);
            tierBadge.innerHTML = `
                <span class="tier-icon">${tierInfo.icon}</span>
                <span class="tier-name">${tierInfo.name}</span>
            `;

            // Count redemptions
            const redemptions = APP_STATE.transactions.filter(t =>
                (normalizeEmployeeId(t.employee_id || t.employeeId) === normalizeEmployeeId(user.employee_id)) && t.type === 'redeem'
            );
            document.getElementById('totalRedeemed').textContent = redemptions.length;
        }
    } else {
        // Manager/Admin summary view - show overview when no employee record
        const totalAllocations = APP_STATE.allocations.length;
        const thisMonth = APP_STATE.allocations.filter(a => isThisMonth(a.created_at)).length;

        document.getElementById('currentPoints').textContent = totalAllocations;
        document.getElementById('totalEarned').textContent = thisMonth;
        document.getElementById('totalRedeemed').textContent = APP_STATE.employees.length;

        const tierBadge = document.getElementById('tierBadge');
        const isAdmin = user.role === 'admin';
        tierBadge.innerHTML = `
            <span class="tier-icon">${isAdmin ? '🛡️' : '👔'}</span>
            <span class="tier-name">${isAdmin ? 'Admin Account' : 'Manager Account'}</span>
        `;
    }

    renderRecentActivity();
}

function getTierInfo(totalPoints) {
    if (totalPoints >= 300) {
        return { name: 'Gold Member', icon: '👑' };
    } else if (totalPoints >= 150) {
        return { name: 'Silver Member', icon: '⭐' };
    } else {
        return { name: 'Bronze Member', icon: '🌟' };
    }
}

function renderRecentActivity() {
    const activityList = document.getElementById('recentActivity');
    const user = APP_STATE.currentUser;

    let activities = [];

    if (user.role === 'employee') {
        // Show employee's allocations and redemptions
        const employeeAllocations = APP_STATE.allocations
            .filter(a => normalizeEmployeeId(a.employee_id || a.employeeId) === normalizeEmployeeId(user.employee_id))
            .map(a => ({
                type: 'earned',
                title: `ได้รับ ${a.points} คะแนน`,
                desc: `จาก ${a.manager_name || a.managerName} - ${SMART_VALUES[a.smart_value || a.smartValue].name}`,
                points: `+${a.points}`,
                date: a.created_at || a.date
            }));

        const employeeRedemptions = APP_STATE.transactions
            .filter(t => normalizeEmployeeId(t.employee_id || t.employeeId) === normalizeEmployeeId(user.employee_id) && t.type === 'redeem')
            .map(t => ({
                type: 'redeemed',
                title: `แลก ${t.reward_name || t.rewardName}`,
                desc: `ใช้ ${t.points} คะแนน`,
                points: `-${t.points}`,
                date: t.created_at || t.date
            }));

        activities = [...employeeAllocations, ...employeeRedemptions];
    } else {
        // Show manager's recent allocations
        activities = APP_STATE.allocations
            .filter(a => normalizeEmployeeId(a.manager_id || a.managerId) === normalizeEmployeeId(user.employee_id))
            .map(a => ({
                type: 'allocated',
                title: `ให้คะแนน ${a.employee_name || a.employeeName}`,
                desc: `${a.points} คะแนน - ${SMART_VALUES[a.smart_value || a.smartValue].name}`,
                points: `${a.points}`,
                date: a.created_at || a.date
            }));
    }

    activities.sort((a, b) => new Date(b.date) - new Date(a.date));
    activities = activities.slice(0, 5);

    if (activities.length === 0) {
        activityList.innerHTML = `
            <div class="empty-state">
                <span class="empty-icon">📭</span>
                <p>ยังไม่มีกิจกรรม</p>
            </div>
        `;
        return;
    }

    activityList.innerHTML = activities.map(activity => `
        <div class="activity-item">
            <div class="activity-info">
                <div class="activity-title">${activity.title}</div>
                <div class="activity-desc">${activity.desc}</div>
                <div class="activity-date">${formatDate(activity.date)}</div>
            </div>
            <div class="activity-points ${activity.type === 'redeemed' ? 'negative' : ''}">${activity.points}</div>
        </div>
    `).join('');
}

// ===========================
// Rewards Catalog
// ===========================
function renderRewards() {
    const grid = document.getElementById('rewardsGrid');
    const categoryFilter = document.getElementById('categoryFilter').value;
    const sortFilter = document.getElementById('sortFilter').value;

    let filtered = [...APP_STATE.rewards];

    // Filter by category
    if (categoryFilter !== 'all') {
        filtered = filtered.filter(r => r.category === categoryFilter);
    }

    // Sort
    if (sortFilter === 'low') {
        filtered.sort((a, b) => a.points - b.points);
    } else if (sortFilter === 'high') {
        filtered.sort((a, b) => b.points - a.points);
    }

    const userPoints = APP_STATE.currentUser.role === 'employee'
        ? (findEmployeeRecord(APP_STATE.currentUser.employee_id)?.points || 0)
        : 0;

    grid.innerHTML = filtered.map(reward => `
        <div class="reward-card" onclick="showRedemptionModal('${reward.id}')">
            <div class="reward-image">${reward.image}</div>
            <div class="reward-content">
                <span class="reward-category">${getCategoryName(reward.category)}</span>
                <h3 class="reward-name">${reward.name}</h3>
                <p class="reward-desc">${reward.desc}</p>
                <div class="reward-footer">
                    <span class="reward-points">${reward.points} คะแนน</span>
                    ${APP_STATE.currentUser.role === 'employee' ? `
                        <button class="btn-redeem" ${userPoints < reward.points ? 'disabled' : ''}>
                            ${userPoints < reward.points ? 'คะแนนไม่พอ' : 'แลก'}
                        </button>
                    ` : ''}
                </div>
            </div>
        </div>
    `).join('');
}

function getCategoryName(category) {
    const names = {
        electronics: 'อิเล็กทรอนิกส์',
        giftcard: 'บัตรของขวัญ',
        experience: 'ประสบการณ์',
        lifestyle: 'ไลฟ์สไตล์'
    };
    return names[category] || category;
}

// Setup filters
document.addEventListener('DOMContentLoaded', () => {
    const categoryFilter = document.getElementById('categoryFilter');
    const sortFilter = document.getElementById('sortFilter');

    if (categoryFilter) {
        categoryFilter.addEventListener('change', renderRewards);
    }
    if (sortFilter) {
        sortFilter.addEventListener('change', renderRewards);
    }
});

// ===========================
// Redemption
// ===========================
function showRedemptionModal(rewardId) {
    if (APP_STATE.currentUser.role !== 'employee') return;

    const reward = APP_STATE.rewards.find(r => r.id === rewardId);
    const employee = findEmployeeRecord(APP_STATE.currentUser.employee_id);

    if (!reward || !employee) return;

    const modal = document.getElementById('redemptionModal');
    const body = document.getElementById('redemptionModalBody');

    const canRedeem = employee.points >= reward.points;

    body.innerHTML = `
        <div style="text-align: center;">
            <div style="font-size: 5rem; margin-bottom: 1rem;">${reward.image}</div>
            <h3 style="margin-bottom: 0.5rem;">${reward.name}</h3>
            <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">${reward.desc}</p>
            
            <div style="background: var(--bg-tertiary); padding: 1rem; border-radius: var(--radius-md); margin-bottom: 1.5rem;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                    <span>คะแนนของคุณ:</span>
                    <strong>${employee.points}</strong>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                    <span>ราคา:</span>
                    <strong style="color: var(--color-primary);">${reward.points}</strong>
                </div>
                <hr style="border: none; border-top: 1px solid rgba(139, 92, 246, 0.2); margin: 0.5rem 0;">
                <div style="display: flex; justify-content: space-between;">
                    <span>คงเหลือหลังแลก:</span>
                    <strong style="color: ${canRedeem ? 'var(--color-success)' : 'var(--color-error)'};">
                        ${canRedeem ? employee.points - reward.points : 'ไม่พอ'}
                    </strong>
                </div>
            </div>
            
            ${canRedeem ? `
                <button class="btn-primary" onclick="confirmRedemption('${rewardId}')" style="width: 100%; margin-bottom: 0.5rem;">
                    ยืนยันการแลก
                </button>
            ` : `
                <div style="background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); color: var(--color-error); padding: 1rem; border-radius: var(--radius-md); margin-bottom: 1rem;">
                    คะแนนของคุณไม่เพียงพอ ต้องการอีก ${reward.points - employee.points} คะแนน
                </div>
            `}
            
            <button class="btn-primary" onclick="closeRedemptionModal()" style="width: 100%; background: var(--bg-tertiary); color: var(--text-primary);">
                ยกเลิก
            </button>
        </div>
    `;

    modal.classList.add('active');
}

function closeRedemptionModal() {
    document.getElementById('redemptionModal').classList.remove('active');
}

function confirmRedemption(rewardId) {
    const reward = APP_STATE.rewards.find(r => r.id === rewardId);
    const employee = findEmployeeRecord(APP_STATE.currentUser.employee_id);

    if (!reward || !employee || employee.points < reward.points) return;

    // Deduct points
    employee.points -= reward.points;

    // Add transaction
    APP_STATE.transactions.push({
        id: 'txn' + Date.now(),
        type: 'redeem',
        employeeId: employee.employee_id,
        rewardId: reward.id,
        rewardName: reward.name,
        points: reward.points,
        date: new Date().toISOString()
    });

    saveData();
    closeRedemptionModal();
    showToast('แลกของรางวัลสำเร็จ! 🎉', 'success');
    updateDashboard();
    renderRewards();
}

// ===========================
// Manager Allocation
// ===========================
function getManagerRemainingAllocations() {
    const thisMonthAllocations = APP_STATE.allocations.filter(a =>
        a.manager_id === APP_STATE.currentUser.employee_id &&
        isThisMonth(a.created_at)
    );

    return Math.max(0, 5 - thisMonthAllocations.length);
}

function renderAllocationForm() {
    const employeeSelect = document.getElementById('employeeSelect');

    // Populate employee dropdown
    employeeSelect.innerHTML = '<option value="">-- เลือกพนักงาน --</option>' +
        APP_STATE.employees.map(emp => {
            const roleLabel = emp.role === 'admin'
                ? 'Admin'
                : emp.role === 'manager'
                    ? 'Manager'
                    : 'Employee';
            return `<option value="${emp.employee_id}">${emp.employee_id} - ${emp.name} (${roleLabel})</option>`;
        }).join('');

    // Setup form handlers
    const form = document.getElementById('allocationForm');
    const reasonInput = document.getElementById('reasonInput');
    const charCount = document.getElementById('charCount');

    reasonInput.addEventListener('input', () => {
        charCount.textContent = reasonInput.value.length;
    });

    employeeSelect.addEventListener('change', updateAllocationInfo);

    form.onsubmit = handleAllocationSubmit;

    renderAllocationHistory();
}

function updateAllocationInfo() {
    const infoDiv = document.getElementById('allocationInfo');

    if (APP_STATE.currentUser.role === 'admin') {
        infoDiv.className = 'allocation-info success';
        infoDiv.innerHTML = '✅ ผู้ดูแลระบบสามารถให้คะแนนได้ไม่จำกัด';
        return;
    }

    // Check manager's monthly allocation limit (5 points total per month)
    const thisMonthAllocations = APP_STATE.allocations.filter(a =>
        a.manager_id === APP_STATE.currentUser.employee_id &&
        isThisMonth(a.created_at)
    );

    const totalThisMonth = thisMonthAllocations.length; // Each allocation is 1 point
    const remaining = 5 - totalThisMonth;

    if (remaining <= 0) {
        infoDiv.className = 'allocation-info error';
        infoDiv.innerHTML = `❌ คุณให้คะแนนครบ 5 ครั้งในเดือนนี้แล้ว (โควต้าหมด)`;
    } else if (remaining <= 2) {
        infoDiv.className = 'allocation-info warning';
        infoDiv.innerHTML = `⚠️ คุณเหลือโควต้าอีก ${remaining} ครั้งสำหรับเดือนนี้`;
    } else {
        infoDiv.className = 'allocation-info success';
        infoDiv.innerHTML = `✅ คุณสามารถให้คะแนนได้อีก ${remaining} ครั้งในเดือนนี้`;
    }
}

async function handleAllocationSubmit(e) {
    e.preventDefault();

    if (!canAllocatePoints(APP_STATE.currentUser)) {
        showToast('เฉพาะ Manager หรือ Admin เท่านั้นที่สามารถให้คะแนนได้', 'error');
        return;
    }

    const employeeId = document.getElementById('employeeSelect').value;
    const points = 1; // Fixed at 1 point per allocation
    const reason = document.getElementById('reasonInput').value;
    const smartValue = document.querySelector('input[name="smartValue"]:checked')?.value;

    if (!employeeId || !reason || !smartValue) {
        showToast('กรุณากรอกข้อมูลให้ครบถ้วน', 'error');
        return;
    }

    if (reason.length < 10) {
        showToast('เหตุผลต้องมีอย่างน้อย 10 ตัวอักษร', 'error');
        return;
    }

    if (APP_STATE.currentUser.role === 'manager') {
        // Check manager's monthly limit (5 allocations total per month)
        const thisMonthAllocations = APP_STATE.allocations.filter(a =>
            a.manager_id === APP_STATE.currentUser.employee_id &&
            isThisMonth(a.created_at)
        );

        if (thisMonthAllocations.length >= 5) {
            showToast('คุณให้คะแนนครบ 5 ครั้งในเดือนนี้แล้ว (โควต้าหมด)', 'error');
            return;
        }
    }

    // Find employee
    const employee = APP_STATE.employees.find(e => e.employee_id === employeeId);
    if (!employee) return;

    try {
        // Insert allocation to Supabase
        const { data: allocation, error: allocError } = await supabase
            .from('allocations')
            .insert([{
                manager_id: APP_STATE.currentUser.employee_id,
                manager_name: APP_STATE.currentUser.name,
                employee_id: employeeId,
                employee_name: employee.name,
                points: points,
                reason: reason,
                smart_value: smartValue
            }])
            .select()
            .single();

        if (allocError) throw allocError;

        // Update employee points in Supabase
        const { error: updateError } = await supabase
            .from('employees')
            .update({
                points: employee.points + points,
                total_earned: employee.total_earned + points,
                updated_at: new Date().toISOString()
            })
            .eq('employee_id', employeeId);

        if (updateError) throw updateError;

        // Update local state
        employee.points += points;
        employee.total_earned += points;
        APP_STATE.allocations.unshift(allocation);

        // Reset form
        e.target.reset();
        document.getElementById('charCount').textContent = '0';
        updateAllocationInfo();

        showToast(`ให้คะแนนสำเร็จ! ${employee.name} ได้รับ ${points} คะแนน 🎉`, 'success');
        renderAllocationHistory();

        const remaining = APP_STATE.currentUser.role === 'admin'
            ? null
            : getManagerRemainingAllocations();
        showAllocationResultModal({
            employeeName: employee.name,
            remaining,
            isAdmin: APP_STATE.currentUser.role === 'admin'
        });
    } catch (error) {
        console.error('Error saving allocation:', error);
        showToast('เกิดข้อผิดพลาดในการบันทึกข้อมูล', 'error');
    }
}

function showAllocationResultModal({ employeeName, remaining, isAdmin }) {
    const modal = document.getElementById('allocationResultModal');
    const body = document.getElementById('allocationResultBody');

    body.innerHTML = `
        <div class="allocation-result">
            <div class="allocation-result-icon">✅</div>
            <div class="allocation-result-title">ให้คะแนนเรียบร้อย</div>
            <div class="allocation-result-card">
                <div class="allocation-result-row">
                    <span>ผู้รับคะแนน</span>
                    <strong>${employeeName}</strong>
                </div>
                <div class="allocation-result-row">
                    <span>โควต้าคงเหลือเดือนนี้</span>
                    <strong>${isAdmin ? 'ไม่จำกัด' : `${remaining} คะแนน`}</strong>
                </div>
            </div>
        </div>
    `;

    modal.classList.add('active');
}

function closeAllocationResultModal() {
    document.getElementById('allocationResultModal').classList.remove('active');
}

function renderAllocationHistory() {
    const historyDiv = document.getElementById('allocationHistory');
    const filterMonth = document.getElementById('filterMonth').value;

    let allocations = [...APP_STATE.allocations];

    if (filterMonth === 'current') {
        allocations = allocations.filter(a => isThisMonth(a.created_at || a.date));
    }

    allocations.sort((a, b) => new Date(b.created_at || b.date) - new Date(a.created_at || a.date));

    if (allocations.length === 0) {
        historyDiv.innerHTML = `
            <div class="empty-state">
                <span class="empty-icon">📋</span>
                <p>ยังไม่มีประวัติการให้คะแนน</p>
            </div>
        `;
        return;
    }

    historyDiv.innerHTML = allocations.map(alloc => `
        <div class="allocation-item">
            <div class="allocation-header">
                <span class="allocation-employee">${alloc.employee_name || alloc.employeeName}</span>
                <span class="allocation-points">+${alloc.points}</span>
            </div>
            <div class="allocation-reason">${alloc.reason}</div>
            <div class="allocation-meta">
                <span class="smart-badge">${alloc.smart_value || alloc.smartValue} - ${SMART_VALUES[alloc.smart_value || alloc.smartValue].name}</span>
                <span>${formatDate(alloc.created_at || alloc.date)}</span>
            </div>
        </div>
    `).join('');
}

// Setup allocation filters
document.addEventListener('DOMContentLoaded', () => {
    const filterMonth = document.getElementById('filterMonth');
    const searchAllocation = document.getElementById('searchAllocation');

    if (filterMonth) {
        filterMonth.addEventListener('change', renderAllocationHistory);
    }

    if (searchAllocation) {
        searchAllocation.addEventListener('input', (e) => {
            const search = e.target.value.toLowerCase();
            const items = document.querySelectorAll('.allocation-item');
            items.forEach(item => {
                const text = item.textContent.toLowerCase();
                item.style.display = text.includes(search) ? '' : 'none';
            });
        });
    }
});

// ===========================
// History
// ===========================
function renderHistory() {
    const historyList = document.getElementById('historyList');
    const filter = document.getElementById('historyFilter').value;
    const user = APP_STATE.currentUser;

    let items = [];

    if (user.role === 'employee') {
        // Employee allocations
        const allocations = APP_STATE.allocations
            .filter(a => normalizeEmployeeId(a.employee_id || a.employeeId) === normalizeEmployeeId(user.employee_id))
            .map(a => ({
                type: 'earned',
                title: `ได้รับคะแนนจาก ${a.manager_name || a.managerName}`,
                desc: `${a.reason} (${SMART_VALUES[a.smart_value || a.smartValue].name})`,
                points: a.points,
                date: a.created_at || a.date
            }));

        // Employee redemptions
        const redemptions = APP_STATE.transactions
            .filter(t => normalizeEmployeeId(t.employee_id || t.employeeId) === normalizeEmployeeId(user.employee_id) && t.type === 'redeem')
            .map(t => ({
                type: 'redeemed',
                title: `แลกของรางวัล`,
                desc: t.reward_name || t.rewardName,
                points: t.points,
                date: t.created_at || t.date
            }));

        items = [...allocations, ...redemptions];
    } else {
        // Manager allocations
        items = APP_STATE.allocations
            .filter(a => normalizeEmployeeId(a.manager_id || a.managerId) === normalizeEmployeeId(user.employee_id))
            .map(a => ({
                type: 'earned',
                title: `ให้คะแนน ${a.employee_name || a.employeeName}`,
                desc: `${a.reason} (${SMART_VALUES[a.smart_value || a.smartValue].name})`,
                points: a.points,
                date: a.created_at || a.date
            }));
    }

    // Apply filter
    if (filter === 'earned') {
        items = items.filter(i => i.type === 'earned');
    } else if (filter === 'redeemed') {
        items = items.filter(i => i.type === 'redeemed');
    }

    items.sort((a, b) => new Date(b.date) - new Date(a.date));

    if (items.length === 0) {
        historyList.innerHTML = `
            <div class="empty-state">
                <span class="empty-icon">📜</span>
                <p>ยังไม่มีประวัติ</p>
            </div>
        `;
        return;
    }

    historyList.innerHTML = items.map(item => `
        <div class="history-item ${item.type}">
            <div class="history-info">
                <div class="history-title">${item.title}</div>
                <div class="history-desc">${item.desc}</div>
                <div class="history-date">${formatDate(item.date)}</div>
            </div>
            <div class="history-points ${item.type === 'earned' ? 'earned' : 'spent'}">
                ${item.type === 'earned' ? '+' : '-'}${item.points}
            </div>
        </div>
    `).join('');
}

// Setup history filter
document.addEventListener('DOMContentLoaded', () => {
    const historyFilter = document.getElementById('historyFilter');
    if (historyFilter) {
        historyFilter.addEventListener('change', renderHistory);
    }
});

// ===========================
// Utility Functions
// ===========================
function normalizeEmployeeId(value) {
    return (value || '').toString().trim().toLowerCase();
}

function findEmployeeRecord(employeeId) {
    const normalized = normalizeEmployeeId(employeeId);
    return APP_STATE.employees.find(e => normalizeEmployeeId(e.employee_id) === normalized) || null;
}

function isThisMonth(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    return date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear();
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'เมื่อสักครู่';
    if (minutes < 60) return `${minutes} นาทีที่แล้ว`;
    if (hours < 24) return `${hours} ชั่วโมงที่แล้ว`;
    if (days < 7) return `${days} วันที่แล้ว`;

    return date.toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type} show`;

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}
