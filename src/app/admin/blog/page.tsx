import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { BlogTable } from '@/components/admin/BlogTable';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Gestión del blog',
};

export default async function BlogAdminPage() {
  const posts = await prisma.blogPost.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Blog</h1>
        <Button asChild>
          <Link href="/admin/blog/nuevo">
            <Plus className="h-4 w-4 mr-2" />
            Nuevo post
          </Link>
        </Button>
      </div>

      {/* Tabla con funcionalidad de eliminar */}
      <BlogTable posts={posts} />
    </div>
  );
}
