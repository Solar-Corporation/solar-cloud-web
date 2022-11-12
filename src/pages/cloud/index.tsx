import { CloudLayout } from '../../client/components/Cloud/Layout';
import { PageHeading } from '../../client/components/PageHeading';
import { IBreadcrumbsItem } from '../../client/components/Breadcrumbs';

export default function Cloud() {
  const links: IBreadcrumbsItem[] = [
    {title: 'Все файлы', href: '/cloud'},
    {title: 'Какая-то папка', href: '/cloud/123'},
    {title: 'Папка', href: '/cloud/143'},
  ]

  return (
    <CloudLayout title="Все файлы">
      <PageHeading links={links} />
      <div style={{ height: '1200px' }} />
    </CloudLayout>
  );
}
