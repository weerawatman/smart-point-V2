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
    transactions: [],
    adminBulkRows: [],
    editingRewardId: null
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
    },
    O: {
        name: 'Other',
        desc: 'เหตุผลอื่นๆ ที่ไม่อยู่ใน SMART'
    }
};

const DEFAULT_REWARDS = [
    {
        name: 'หูฟังบลูทูธ Premium',
        description: 'หูฟังไร้สายคุณภาพสูง เสียงใส ตัดเสียงรบกวน',
        points: 150,
        category: 'electronics',
        image_url: '🎧'
    },
    {
        name: 'บัตรกำนัล Starbucks 500 บาท',
        description: 'บัตรกำนัลสตาร์บัคส์ มูลค่า 500 บาท',
        points: 50,
        category: 'giftcard',
        image_url: '☕'
    },
    {
        name: 'Smart Watch',
        description: 'นาฬิกาอัจฉริยะ ติดตามสุขภาพ ออกกำลังกาย',
        points: 300,
        category: 'electronics',
        image_url: '⌚'
    },
    {
        name: 'คอร์สออนไลน์ Udemy',
        description: 'เลือกคอร์สเรียนออนไลน์ได้ 1 คอร์ส',
        points: 80,
        category: 'experience',
        image_url: '📚'
    },
    {
        name: 'กระเป๋าเป้แบรนด์เนม',
        description: 'กระเป๋าเป้สุดเท่ ใส่โน้ตบุ๊คได้',
        points: 200,
        category: 'lifestyle',
        image_url: '🎒'
    },
    {
        name: 'บัตรชมภาพยนตร์ 2 ที่นั่ง',
        description: 'บัตรชมหนังฟรี 2 ที่นั่ง ทุกโรงในเครือ',
        points: 60,
        category: 'experience',
        image_url: '🎬'
    },
    {
        name: 'Power Bank 20000mAh',
        description: 'แบตสำรอง ชาร์จเร็ว รองรับทุกอุปกรณ์',
        points: 100,
        category: 'electronics',
        image_url: '🔋'
    },
    {
        name: 'บัตรกำนัล Central 1000 บาท',
        description: 'บัตรกำนัลห้างเซ็นทรัล มูลค่า 1000 บาท',
        points: 100,
        category: 'giftcard',
        image_url: '🎁'
    }
];

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

        // Fetch rewards
        const { data: rewards, error: rewardsError } = await supabase
            .from('rewards')
            .select('*')
            .order('points', { ascending: true });

        if (rewardsError) {
            console.warn('⚠️ Rewards load failed, using defaults:', rewardsError);
            APP_STATE.rewards = DEFAULT_REWARDS.map((reward, index) => ({
                id: `local-${index + 1}`,
                ...reward
            }));
        } else {
            APP_STATE.rewards = rewards || [];
            console.log('✅ Loaded rewards:', rewards?.length || 0);
        }

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
    showAdminFeatures();
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

function showAdminFeatures() {
    const adminElements = document.querySelectorAll('.admin-only');
    const isAdmin = APP_STATE.currentUser?.role === 'admin';

    adminElements.forEach(el => {
        el.style.display = isAdmin ? '' : 'none';
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
            <div class="reward-image">${getRewardImageHtml(reward)}</div>
            <div class="reward-content">
                <span class="reward-category">${getCategoryName(reward.category)}</span>
                <h3 class="reward-name">${reward.name}</h3>
                <p class="reward-desc">${reward.description || reward.desc || ''}</p>
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

    renderRewardsAdminPanel();
}

function getRewardImageHtml(reward) {
    const image = reward.image_url || reward.image || '🎁';
    const isUrl = typeof image === 'string' && (image.startsWith('http://') || image.startsWith('https://') || image.startsWith('data:'));
    if (isUrl) {
        return `<img src="${image}" alt="${reward.name}">`;
    }
    return image;
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
            <div style="font-size: 5rem; margin-bottom: 1rem;">${getRewardImageHtml(reward)}</div>
            <h3 style="margin-bottom: 0.5rem;">${reward.name}</h3>
            <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">${reward.description || reward.desc || ''}</p>
            
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

function renderRewardsAdminPanel() {
    if (APP_STATE.currentUser.role !== 'admin') return;

    const list = document.getElementById('adminRewardsList');
    const form = document.getElementById('rewardForm');
    const cancelBtn = document.getElementById('cancelRewardEdit');
    const preview = document.getElementById('rewardPreview');
    const imageInput = document.getElementById('rewardImage');
    const submitBtn = document.getElementById('rewardSubmitBtn');

    if (!list || !form) return;

    list.innerHTML = APP_STATE.rewards.map(reward => `
        <div class="admin-reward-item">
            <div class="admin-reward-info">
                <strong>${reward.name}</strong>
                <span>${reward.points} คะแนน • ${getCategoryName(reward.category)}</span>
            </div>
            <div class="admin-reward-actions">
                <button class="btn-outline" data-action="edit" data-id="${reward.id}">แก้ไข</button>
                <button class="btn-outline" data-action="delete" data-id="${reward.id}">ลบ</button>
            </div>
        </div>
    `).join('');

    list.onclick = (event) => {
        const button = event.target.closest('button');
        if (!button) return;
        const id = button.dataset.id;
        const action = button.dataset.action;
        if (!id || !action) return;

        if (action === 'edit') {
            startRewardEdit(id);
        } else if (action === 'delete') {
            deleteReward(id);
        }
    };

    form.onsubmit = handleRewardSubmit;

    if (imageInput) {
        imageInput.addEventListener('input', () => {
            updateRewardPreview(imageInput.value);
        });
    }

    if (cancelBtn) {
        cancelBtn.onclick = resetRewardForm;
        cancelBtn.style.display = APP_STATE.editingRewardId ? '' : 'none';
    }

    if (preview) {
        updateRewardPreview(imageInput?.value || '');
    }

    if (submitBtn) {
        submitBtn.textContent = APP_STATE.editingRewardId ? 'บันทึกการแก้ไข' : 'เพิ่มของรางวัล';
    }
}

function updateRewardPreview(value) {
    const preview = document.getElementById('rewardPreview');
    if (!preview) return;

    if (!value) {
        preview.textContent = 'ตัวอย่างรูปภาพจะอยู่ที่นี่';
        return;
    }

    const isUrl = value.startsWith('http://') || value.startsWith('https://') || value.startsWith('data:');
    preview.innerHTML = isUrl ? `<img src="${value}" alt="preview">` : `<span style="font-size: 2.5rem;">${value}</span>`;
}

function startRewardEdit(rewardId) {
    const reward = APP_STATE.rewards.find(r => r.id === rewardId);
    if (!reward) return;

    APP_STATE.editingRewardId = rewardId;
    document.getElementById('rewardName').value = reward.name;
    document.getElementById('rewardDesc').value = reward.description || reward.desc || '';
    document.getElementById('rewardPoints').value = reward.points;
    document.getElementById('rewardCategory').value = reward.category;
    document.getElementById('rewardImage').value = reward.image_url || reward.image || '';
    updateRewardPreview(reward.image_url || reward.image || '');
    renderRewardsAdminPanel();
}

function resetRewardForm() {
    APP_STATE.editingRewardId = null;
    const form = document.getElementById('rewardForm');
    if (form) form.reset();
    updateRewardPreview('');
    renderRewardsAdminPanel();
}

async function handleRewardSubmit(e) {
    e.preventDefault();

    const name = document.getElementById('rewardName').value.trim();
    const description = document.getElementById('rewardDesc').value.trim();
    const points = Math.max(1, Number(document.getElementById('rewardPoints').value || 1));
    const category = document.getElementById('rewardCategory').value;
    const imageUrl = document.getElementById('rewardImage').value.trim();

    if (!name || !description || !points || !category || !imageUrl) {
        showToast('กรุณากรอกข้อมูลให้ครบถ้วน', 'error');
        return;
    }

    try {
        if (APP_STATE.editingRewardId) {
            const { error } = await supabase
                .from('rewards')
                .update({
                    name,
                    description,
                    points,
                    category,
                    image_url: imageUrl
                })
                .eq('id', APP_STATE.editingRewardId);

            if (error) throw error;

            const reward = APP_STATE.rewards.find(r => r.id === APP_STATE.editingRewardId);
            if (reward) {
                reward.name = name;
                reward.description = description;
                reward.points = points;
                reward.category = category;
                reward.image_url = imageUrl;
            }

            showToast('แก้ไขของรางวัลสำเร็จ', 'success');
        } else {
            const { data, error } = await supabase
                .from('rewards')
                .insert([{ name, description, points, category, image_url: imageUrl }])
                .select()
                .single();

            if (error) throw error;

            APP_STATE.rewards.unshift(data);
            showToast('เพิ่มของรางวัลสำเร็จ', 'success');
        }

        resetRewardForm();
        renderRewards();
    } catch (error) {
        console.error('Error saving reward:', error);
        showToast('เกิดข้อผิดพลาดในการบันทึกของรางวัล', 'error');
    }
}

async function deleteReward(rewardId) {
    const reward = APP_STATE.rewards.find(r => r.id === rewardId);
    if (!reward) return;

    try {
        const { error } = await supabase
            .from('rewards')
            .delete()
            .eq('id', rewardId);

        if (error) throw error;

        APP_STATE.rewards = APP_STATE.rewards.filter(r => r.id !== rewardId);
        showToast('ลบของรางวัลแล้ว', 'success');
        renderRewards();
    } catch (error) {
        console.error('Error deleting reward:', error);
        showToast('ลบของรางวัลไม่สำเร็จ', 'error');
    }
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
function renderAllocationForm() {
    const employeeSelect = document.getElementById('employeeSelect');
    const groupEmployeeList = document.getElementById('groupEmployeeList');
    const allocationModeInputs = document.querySelectorAll('input[name="allocationMode"]');
    const selectAllBtn = document.getElementById('selectAllEmployees');
    const clearAllBtn = document.getElementById('clearAllEmployees');
    const excelFile = document.getElementById('excelFile');

    // Populate employee dropdown
    employeeSelect.innerHTML = '<option value="">-- เลือกพนักงาน --</option>' +
        APP_STATE.employees
            .filter(emp => normalizeEmployeeId(emp.employee_id) !== normalizeEmployeeId(APP_STATE.currentUser.employee_id))
            .map(emp => `<option value="${emp.employee_id}">${emp.employee_id} - ${emp.name}</option>`)
            .join('');

    if (groupEmployeeList) {
        groupEmployeeList.innerHTML = APP_STATE.employees
            .filter(emp => normalizeEmployeeId(emp.employee_id) !== normalizeEmployeeId(APP_STATE.currentUser.employee_id))
            .map(emp => `
                <label class="group-item">
                    <input type="checkbox" value="${emp.employee_id}">
                    <span>${emp.employee_id} - ${emp.name}</span>
                </label>
            `)
            .join('');
    }

    // Setup form handlers
    const form = document.getElementById('allocationForm');
    const reasonInput = document.getElementById('reasonInput');
    const charCount = document.getElementById('charCount');

    reasonInput.addEventListener('input', () => {
        charCount.textContent = reasonInput.value.length;
    });

    employeeSelect.addEventListener('change', updateAllocationInfo);

    allocationModeInputs.forEach(input => {
        input.addEventListener('change', updateAllocationModeView);
    });

    const groupSearch = document.getElementById('groupSearch');
    if (groupSearch) {
        groupSearch.addEventListener('input', (e) => {
            const search = e.target.value.toLowerCase();
            const items = document.querySelectorAll('.group-item');
            items.forEach(item => {
                const text = item.textContent.toLowerCase();
                item.style.display = text.includes(search) ? '' : 'none';
            });
        });
    }

    if (groupEmployeeList) {
        groupEmployeeList.addEventListener('change', updateGroupSelectionInfo);
    }

    if (selectAllBtn) {
        selectAllBtn.addEventListener('click', () => {
            document.querySelectorAll('#groupEmployeeList input[type="checkbox"]').forEach(input => {
                input.checked = true;
            });
            updateGroupSelectionInfo();
        });
    }

    if (clearAllBtn) {
        clearAllBtn.addEventListener('click', () => {
            document.querySelectorAll('#groupEmployeeList input[type="checkbox"]').forEach(input => {
                input.checked = false;
            });
            updateGroupSelectionInfo();
        });
    }

    if (excelFile) {
        excelFile.addEventListener('change', (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            importAdminCsv(file);
        });
    }

    form.onsubmit = handleAllocationSubmit;

    updateAllocationModeView();

    renderAllocationHistory();
}

function updateAllocationModeView() {
    const mode = document.querySelector('input[name="allocationMode"]:checked')?.value || 'single';
    const singleGroup = document.getElementById('singleEmployeeSelectGroup');
    const groupGroup = document.getElementById('groupEmployeeSelectGroup');
    const excelGroup = document.getElementById('excelUploadGroup');
    const adminPointsGroup = document.getElementById('adminPointsGroup');
    const fixedPointsGroup = document.querySelector('.points-fixed')?.parentElement;
    const employeeSelect = document.getElementById('employeeSelect');

    if (APP_STATE.currentUser.role !== 'admin') {
        if (singleGroup) singleGroup.style.display = '';
        if (groupGroup) groupGroup.style.display = 'none';
        if (excelGroup) excelGroup.style.display = 'none';
        if (adminPointsGroup) adminPointsGroup.style.display = 'none';
        if (fixedPointsGroup) fixedPointsGroup.style.display = '';
        if (employeeSelect) employeeSelect.required = true;
        return;
    }

    if (singleGroup) singleGroup.style.display = mode === 'single' ? '' : 'none';
    if (groupGroup) groupGroup.style.display = mode === 'group' ? '' : 'none';
    if (excelGroup) excelGroup.style.display = mode === 'excel' ? '' : 'none';
    if (adminPointsGroup) adminPointsGroup.style.display = mode === 'excel' ? 'none' : '';
    if (fixedPointsGroup) fixedPointsGroup.style.display = 'none';
    if (employeeSelect) employeeSelect.required = mode === 'single';
    updateGroupSelectionInfo();
    updateExcelImportInfo();
}

function getSelectedGroupEmployees() {
    const selected = Array.from(document.querySelectorAll('#groupEmployeeList input[type="checkbox"]:checked'))
        .map(input => input.value);
    return selected;
}

function updateGroupSelectionInfo() {
    const infoDiv = document.getElementById('groupSelectionInfo');
    if (!infoDiv) return;

    const selected = getSelectedGroupEmployees();
    if (selected.length === 0) {
        infoDiv.className = 'allocation-info warning';
        infoDiv.textContent = 'กรุณาเลือกพนักงานอย่างน้อย 1 คน';
        return;
    }

    infoDiv.className = 'allocation-info success';
    infoDiv.textContent = `เลือกแล้ว ${selected.length} คน`;
}

function updateExcelImportInfo() {
    const infoDiv = document.getElementById('excelImportInfo');
    if (!infoDiv) return;

    if (!APP_STATE.adminBulkRows.length) {
        infoDiv.className = 'allocation-info warning';
        infoDiv.textContent = 'ยังไม่มีข้อมูลนำเข้า';
        return;
    }

    infoDiv.className = 'allocation-info success';
    infoDiv.textContent = `นำเข้าข้อมูลแล้ว ${APP_STATE.adminBulkRows.length} รายการ`;
}

function importAdminCsv(file) {
    const infoDiv = document.getElementById('excelImportInfo');
    const reader = new FileReader();

    reader.onload = () => {
        const text = reader.result?.toString() || '';
        APP_STATE.adminBulkRows = parseCsvRows(text);
        updateExcelImportInfo();
        if (!APP_STATE.adminBulkRows.length) {
            showToast('ไม่พบข้อมูลในไฟล์ CSV', 'error');
        }
    };

    reader.onerror = () => {
        if (infoDiv) {
            infoDiv.className = 'allocation-info error';
            infoDiv.textContent = 'อ่านไฟล์ไม่สำเร็จ';
        }
        showToast('อ่านไฟล์ไม่สำเร็จ', 'error');
    };

    reader.readAsText(file);
}

function parseCsvRows(text) {
    const lines = text.split(/\r?\n/).filter(line => line.trim().length > 0);
    if (lines.length === 0) return [];

    const delimiter = lines[0].includes('\t') ? '\t' : lines[0].includes(';') ? ';' : ',';
    const header = lines[0].split(delimiter).map(h => h.trim().toLowerCase());

    const employeeIndex = header.findIndex(h => h.includes('employee') || h.includes('รหัส'));
    const pointsIndex = header.findIndex(h => h.includes('point') || h.includes('คะแนน'));
    const reasonIndex = header.findIndex(h => h.includes('reason') || h.includes('เหตุผล'));

    const rows = [];
    for (let i = 1; i < lines.length; i += 1) {
        const cols = lines[i].split(delimiter).map(c => c.trim());
        const employeeId = cols[employeeIndex] || cols[0];
        const pointsRaw = cols[pointsIndex] || cols[1] || '1';
        const reason = cols[reasonIndex] || cols[2] || '';

        if (!employeeId) continue;
        const points = Math.max(1, Number(pointsRaw) || 1);

        rows.push({
            employeeId,
            points,
            reason
        });
    }

    return rows;
}

function updateAllocationInfo() {
    const infoDiv = document.getElementById('allocationInfo');
    const employeeId = document.getElementById('employeeSelect')?.value;

    if (APP_STATE.currentUser.role === 'admin') {
        infoDiv.className = 'allocation-info success';
        infoDiv.innerHTML = '✅ ผู้ดูแลระบบสามารถให้คะแนนได้ไม่จำกัด';
        return;
    }

    if (!employeeId) {
        infoDiv.className = 'allocation-info warning';
        infoDiv.innerHTML = 'กรุณาเลือกพนักงานเพื่อดูโควต้า';
        return;
    }

    // Check manager's monthly allocation limit (5 points per employee per month)
    const thisMonthAllocations = APP_STATE.allocations.filter(a =>
        a.manager_id === APP_STATE.currentUser.employee_id &&
        isThisMonth(a.created_at) &&
        normalizeEmployeeId(a.employee_id || a.employeeId) === normalizeEmployeeId(employeeId)
    );

    const totalThisMonth = thisMonthAllocations.length; // Each allocation is 1 point
    const remaining = 5 - totalThisMonth;

    if (remaining <= 0) {
        infoDiv.className = 'allocation-info error';
        infoDiv.innerHTML = `❌ คุณให้คะแนนครบ 5 คะแนนให้พนักงานคนนี้ในเดือนนี้แล้ว`;
    } else if (remaining <= 2) {
        infoDiv.className = 'allocation-info warning';
        infoDiv.innerHTML = `⚠️ คุณเหลือโควต้าอีก ${remaining} คะแนนสำหรับพนักงานคนนี้ในเดือนนี้`;
    } else {
        infoDiv.className = 'allocation-info success';
        infoDiv.innerHTML = `✅ คุณสามารถให้คะแนนได้อีก ${remaining} คะแนนสำหรับพนักงานคนนี้ในเดือนนี้`;
    }
}

async function handleAllocationSubmit(e) {
    e.preventDefault();

    if (!canAllocatePoints(APP_STATE.currentUser)) {
        showToast('เฉพาะ Manager หรือ Admin เท่านั้นที่สามารถให้คะแนนได้', 'error');
        return;
    }

    const mode = document.querySelector('input[name="allocationMode"]:checked')?.value || 'single';
    const employeeId = document.getElementById('employeeSelect').value;
    const pointsInput = document.getElementById('pointsInput');
    const points = APP_STATE.currentUser.role === 'admin'
        ? Math.max(1, Number(pointsInput?.value || 1))
        : 1; // Fixed at 1 point per allocation
    const reason = document.getElementById('reasonInput').value;
    const smartValue = document.querySelector('input[name="smartValue"]:checked')?.value;

    if ((!employeeId && mode === 'single') || !reason || !smartValue) {
        showToast('กรุณากรอกข้อมูลให้ครบถ้วน', 'error');
        return;
    }

    if (mode === 'single') {
        if (normalizeEmployeeId(employeeId) === normalizeEmployeeId(APP_STATE.currentUser.employee_id)) {
            showToast('ไม่สามารถให้คะแนนตัวเองได้', 'error');
            return;
        }
    }

    if (reason.length < 10) {
        showToast('เหตุผลต้องมีอย่างน้อย 10 ตัวอักษร', 'error');
        return;
    }

    if (APP_STATE.currentUser.role === 'manager') {
        // Check manager's monthly limit (5 points per employee per month)
        const thisMonthAllocations = APP_STATE.allocations.filter(a =>
            a.manager_id === APP_STATE.currentUser.employee_id &&
            isThisMonth(a.created_at) &&
            normalizeEmployeeId(a.employee_id || a.employeeId) === normalizeEmployeeId(employeeId)
        );

        if (thisMonthAllocations.length >= 5) {
            showToast('คุณให้คะแนนครบ 5 คะแนนสำหรับพนักงานคนนี้ในเดือนนี้แล้ว', 'error');
            return;
        }
    }

    if (APP_STATE.currentUser.role === 'admin' && mode === 'group') {
        const selectedEmployeeIds = getSelectedGroupEmployees();
        if (selectedEmployeeIds.length === 0) {
            showToast('กรุณาเลือกพนักงานอย่างน้อย 1 คน', 'error');
            return;
        }

        const allocationsPayload = selectedEmployeeIds
            .filter(id => normalizeEmployeeId(id) !== normalizeEmployeeId(APP_STATE.currentUser.employee_id))
            .map(id => {
                const employee = APP_STATE.employees.find(e => normalizeEmployeeId(e.employee_id) === normalizeEmployeeId(id));
                return {
                    manager_id: APP_STATE.currentUser.employee_id,
                    manager_name: APP_STATE.currentUser.name,
                    employee_id: id,
                    employee_name: employee?.name || id,
                    points: points,
                    reason: reason,
                    smart_value: smartValue
                };
            });

        try {
            const { data: allocationRows, error: allocError } = await supabase
                .from('allocations')
                .insert(allocationsPayload)
                .select();

            if (allocError) throw allocError;

            const updatePromises = selectedEmployeeIds.map(id => {
                const employee = APP_STATE.employees.find(e => normalizeEmployeeId(e.employee_id) === normalizeEmployeeId(id));
                if (!employee) return null;
                const totalEarned = employee.total_earned ?? employee.totalEarned ?? 0;
                return supabase
                    .from('employees')
                    .update({
                        points: employee.points + points,
                        total_earned: totalEarned + points,
                        updated_at: new Date().toISOString()
                    })
                    .eq('employee_id', employee.employee_id);
            }).filter(Boolean);

            await Promise.all(updatePromises);

            selectedEmployeeIds.forEach(id => {
                const employee = APP_STATE.employees.find(e => normalizeEmployeeId(e.employee_id) === normalizeEmployeeId(id));
                if (employee) {
                    employee.points += points;
                    const totalEarned = employee.total_earned ?? employee.totalEarned ?? 0;
                    employee.total_earned = totalEarned + points;
                }
            });

            if (allocationRows?.length) {
                APP_STATE.allocations = allocationRows.concat(APP_STATE.allocations);
            }

            e.target.reset();
            document.getElementById('charCount').textContent = '0';
            updateAllocationInfo();
            updateGroupSelectionInfo();

            showToast(`ให้คะแนนสำเร็จ! ${selectedEmployeeIds.length} คน 🎉`, 'success');
            renderAllocationHistory();

            showAllocationResultModal({
                employeeName: `${selectedEmployeeIds.length} คน`,
                remaining: null,
                isAdmin: true
            });
        } catch (error) {
            console.error('Error saving allocation:', error);
            showToast('เกิดข้อผิดพลาดในการบันทึกข้อมูล', 'error');
        }
        return;
    }

    if (APP_STATE.currentUser.role === 'admin' && mode === 'excel') {
        if (!APP_STATE.adminBulkRows.length) {
            showToast('กรุณาแนบไฟล์ CSV ที่มีข้อมูลให้คะแนน', 'error');
            return;
        }

        const rows = APP_STATE.adminBulkRows.filter(row =>
            normalizeEmployeeId(row.employeeId) !== normalizeEmployeeId(APP_STATE.currentUser.employee_id)
        );

        if (!rows.length) {
            showToast('ไม่มีรายการที่สามารถให้คะแนนได้', 'error');
            return;
        }

        const allocationsPayload = rows.map(row => {
            const employee = APP_STATE.employees.find(e => normalizeEmployeeId(e.employee_id) === normalizeEmployeeId(row.employeeId));
            return {
                manager_id: APP_STATE.currentUser.employee_id,
                manager_name: APP_STATE.currentUser.name,
                employee_id: row.employeeId,
                employee_name: employee?.name || row.employeeId,
                points: Math.max(1, Number(row.points) || 1),
                reason: row.reason || reason,
                smart_value: smartValue
            };
        });

        try {
            const { data: allocationRows, error: allocError } = await supabase
                .from('allocations')
                .insert(allocationsPayload)
                .select();

            if (allocError) throw allocError;

            const updatePromises = allocationsPayload.map(row => {
                const employee = APP_STATE.employees.find(e => normalizeEmployeeId(e.employee_id) === normalizeEmployeeId(row.employee_id));
                if (!employee) return null;
                const totalEarned = employee.total_earned ?? employee.totalEarned ?? 0;
                return supabase
                    .from('employees')
                    .update({
                        points: employee.points + row.points,
                        total_earned: totalEarned + row.points,
                        updated_at: new Date().toISOString()
                    })
                    .eq('employee_id', employee.employee_id);
            }).filter(Boolean);

            await Promise.all(updatePromises);

            allocationsPayload.forEach(row => {
                const employee = APP_STATE.employees.find(e => normalizeEmployeeId(e.employee_id) === normalizeEmployeeId(row.employee_id));
                if (employee) {
                    employee.points += row.points;
                    const totalEarned = employee.total_earned ?? employee.totalEarned ?? 0;
                    employee.total_earned = totalEarned + row.points;
                }
            });

            if (allocationRows?.length) {
                APP_STATE.allocations = allocationRows.concat(APP_STATE.allocations);
            }

            e.target.reset();
            APP_STATE.adminBulkRows = [];
            updateAllocationInfo();
            updateExcelImportInfo();

            showToast(`ให้คะแนนสำเร็จ! ${allocationsPayload.length} รายการ 🎉`, 'success');
            renderAllocationHistory();

            showAllocationResultModal({
                employeeName: `${allocationsPayload.length} รายการ`,
                remaining: null,
                isAdmin: true
            });
        } catch (error) {
            console.error('Error saving allocation:', error);
            showToast('เกิดข้อผิดพลาดในการบันทึกข้อมูล', 'error');
        }
        return;
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
            : Math.max(0, 5 - APP_STATE.allocations.filter(a =>
                a.manager_id === APP_STATE.currentUser.employee_id &&
                isThisMonth(a.created_at) &&
                normalizeEmployeeId(a.employee_id || a.employeeId) === normalizeEmployeeId(employeeId)
            ).length);
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
