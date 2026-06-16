import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard() {
    return (
        <AuthenticatedLayout

            header={<h2 className="text-xl font-semibold text-white">Dashboard</h2>}>
            <Head title="Dashboard" />


        </AuthenticatedLayout>
    );
}
