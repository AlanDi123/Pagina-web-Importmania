import { Metadata } from 'next';
import { BlogEditor } from '@/components/admin/BlogEditor';

export const metadata: Metadata = {
  title: 'Nuevo Post',
  description: 'Crear nuevo post del blog',
};

export default function NuevoBlogPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Nuevo Post</h1>
      <BlogEditor mode="create" />
    </div>
  );
}
