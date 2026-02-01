import { useState } from 'react'
import { Save, Trash2, Edit, User, Settings, LogOut } from 'lucide-react'
import {
    Button,
    Input,
    Card,
    Modal,
    Badge,
    Table,
    Pagination,
    Spinner,
    Avatar,
    Dropdown,
    Alert,
} from '../components/common'

const ComponentShowcase = () => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [inputValue, setInputValue] = useState('')
    const [inputError, setInputError] = useState('')

    // Sample table data
    const tableColumns = [
        { key: 'id', label: 'الرقم' },
        { key: 'name', label: 'الاسم' },
        { key: 'email', label: 'البريد الإلكتروني' },
        {
            key: 'status',
            label: 'الحالة',
            render: (value) => (
                <Badge variant={value === 'نشط' ? 'success' : 'error'}>
                    {value}
                </Badge>
            ),
        },
    ]

    const tableData = [
        { id: 1, name: 'أحمد محمد', email: 'ahmed@example.com', status: 'نشط' },
        { id: 2, name: 'فاطمة علي', email: 'fatima@example.com', status: 'نشط' },
        { id: 3, name: 'محمود حسن', email: 'mahmoud@example.com', status: 'غير نشط' },
    ]

    const dropdownItems = [
        { label: 'الملف الشخصي', icon: <User size={16} />, onClick: () => console.log('Profile') },
        { label: 'الإعدادات', icon: <Settings size={16} />, onClick: () => console.log('Settings') },
        { divider: true },
        { label: 'تسجيل الخروج', icon: <LogOut size={16} />, onClick: () => console.log('Logout'), danger: true },
    ]

    return (
        <div className="min-h-screen bg-background p-8">
            <div className="container-custom max-w-6xl">
                <h1 className="text-4xl font-heading font-bold gradient-text mb-8 text-center">
                    معرض المكونات
                </h1>

                <div className="space-y-12">
                    {/* Buttons */}
                    <Section title="الأزرار (Buttons)">
                        <div className="flex flex-wrap gap-4">
                            <Button variant="primary">زر أساسي</Button>
                            <Button variant="secondary">زر ثانوي</Button>
                            <Button variant="outline">زر محدد</Button>
                            <Button variant="ghost">زر شفاف</Button>
                            <Button variant="danger">زر خطر</Button>
                        </div>

                        <div className="flex flex-wrap gap-4 mt-4">
                            <Button size="sm">صغير</Button>
                            <Button size="md">متوسط</Button>
                            <Button size="lg">كبير</Button>
                        </div>

                        <div className="flex flex-wrap gap-4 mt-4">
                            <Button icon={<Save size={20} />}>حفظ</Button>
                            <Button icon={<Trash2 size={20} />} variant="danger">
                                حذف
                            </Button>
                            <Button loading>جاري التحميل</Button>
                            <Button disabled>معطل</Button>
                        </div>
                    </Section>

                    {/* Inputs */}
                    <Section title="حقول الإدخال (Inputs)">
                        <div className="grid md:grid-cols-2 gap-4">
                            <Input
                                label="الاسم الكامل"
                                name="fullName"
                                placeholder="أدخل اسمك الكامل"
                                required
                            />
                            <Input
                                label="البريد الإلكتروني"
                                name="email"
                                type="email"
                                placeholder="example@domain.com"
                                icon={<User size={20} />}
                            />
                            <Input
                                label="كلمة المرور"
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                helperText="يجب أن تكون 8 أحرف على الأقل"
                            />
                            <Input
                                label="رقم الهاتف"
                                name="phone"
                                type="tel"
                                value={inputValue}
                                onChange={(e) => {
                                    setInputValue(e.target.value)
                                    if (e.target.value.length < 10) {
                                        setInputError('رقم الهاتف يجب أن يكون 10 أرقام')
                                    } else {
                                        setInputError('')
                                    }
                                }}
                                error={inputError}
                            />
                        </div>
                    </Section>

                    {/* Cards */}
                    <Section title="البطاقات (Cards)">
                        <div className="grid md:grid-cols-3 gap-4">
                            <Card shadow="sm">
                                <h3 className="font-bold mb-2">بطاقة بسيطة</h3>
                                <p className="text-text-secondary">محتوى البطاقة هنا</p>
                            </Card>
                            <Card shadow="md" hover>
                                <h3 className="font-bold mb-2">بطاقة مع تأثير</h3>
                                <p className="text-text-secondary">مرر الماوس لرؤية التأثير</p>
                            </Card>
                            <Card shadow="lg" glass>
                                <h3 className="font-bold mb-2">بطاقة زجاجية</h3>
                                <p className="text-text-secondary">تأثير Glassmorphism</p>
                            </Card>
                        </div>
                    </Section>

                    {/* Badges */}
                    <Section title="الشارات (Badges)">
                        <div className="flex flex-wrap gap-3">
                            <Badge variant="success">نجاح</Badge>
                            <Badge variant="warning">تحذير</Badge>
                            <Badge variant="error">خطأ</Badge>
                            <Badge variant="info">معلومة</Badge>
                            <Badge variant="neutral">محايد</Badge>
                        </div>
                        <div className="flex flex-wrap gap-3 mt-4">
                            <Badge variant="success" dot>
                                متصل
                            </Badge>
                            <Badge variant="error" dot>
                                غير متصل
                            </Badge>
                            <Badge variant="warning" size="lg">
                                كبير
                            </Badge>
                        </div>
                    </Section>

                    {/* Alerts */}
                    <Section title="التنبيهات (Alerts)">
                        <div className="space-y-4">
                            <Alert variant="success">تم حفظ البيانات بنجاح!</Alert>
                            <Alert variant="warning">يرجى مراجعة البيانات المدخلة</Alert>
                            <Alert variant="error">حدث خطأ أثناء معالجة الطلب</Alert>
                            <Alert variant="info" dismissible>
                                هذه رسالة معلوماتية يمكن إغلاقها
                            </Alert>
                        </div>
                    </Section>

                    {/* Avatars */}
                    <Section title="الصور الرمزية (Avatars)">
                        <div className="flex flex-wrap items-end gap-4">
                            <Avatar name="أحمد محمد" size="xs" />
                            <Avatar name="فاطمة علي" size="sm" status="online" />
                            <Avatar name="محمود حسن" size="md" status="busy" />
                            <Avatar name="سارة أحمد" size="lg" status="away" />
                            <Avatar name="عمر خالد" size="xl" status="offline" />
                        </div>
                    </Section>

                    {/* Dropdown */}
                    <Section title="القائمة المنسدلة (Dropdown)">
                        <Dropdown trigger="القائمة" items={dropdownItems} />
                    </Section>

                    {/* Table */}
                    <Section title="الجدول (Table)">
                        <Card>
                            <Table
                                columns={tableColumns}
                                data={tableData}
                                striped
                                hoverable
                            />
                        </Card>
                    </Section>

                    {/* Pagination */}
                    <Section title="ترقيم الصفحات (Pagination)">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={10}
                            onPageChange={setCurrentPage}
                            showFirstLast
                        />
                    </Section>

                    {/* Spinners */}
                    <Section title="مؤشرات التحميل (Spinners)">
                        <div className="flex items-center gap-8">
                            <Spinner size="sm" />
                            <Spinner size="md" />
                            <Spinner size="lg" />
                            <Spinner color="secondary" />
                            <Spinner color="success" />
                        </div>
                    </Section>

                    {/* Modal */}
                    <Section title="النافذة المنبثقة (Modal)">
                        <Button onClick={() => setIsModalOpen(true)}>فتح النافذة</Button>
                        <Modal
                            isOpen={isModalOpen}
                            onClose={() => setIsModalOpen(false)}
                            title="عنوان النافذة"
                            size="md"
                        >
                            <p className="mb-4">
                                هذا محتوى النافذة المنبثقة. يمكنك وضع أي محتوى هنا.
                            </p>
                            <div className="flex gap-3 justify-end">
                                <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                                    إلغاء
                                </Button>
                                <Button onClick={() => setIsModalOpen(false)}>تأكيد</Button>
                            </div>
                        </Modal>
                    </Section>
                </div>
            </div>
        </div>
    )
}

const Section = ({ title, children }) => {
    return (
        <div>
            <h2 className="text-2xl font-bold mb-4 text-text-primary">{title}</h2>
            <div className="bg-surface border border-border rounded-xl p-6">
                {children}
            </div>
        </div>
    )
}

export default ComponentShowcase
