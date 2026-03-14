import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { BlogEditor } from '@/components/admin/BlogEditor';

interface BlogEditPageProps {
  params: { id: string };
}

export const metadata: Metadata = {
  title: 'Editar Post',
  description: 'Editar post del blog',
};

export default async function BlogEditPage({ params }: BlogEditPageProps) {
  const post = await prisma.blogPost.findUnique({
    where: { id: params.id },
  });

  if (!post) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Editar Post</h1>
      <BlogEditor post={post} mode="edit" />
    </div>
  );
}
