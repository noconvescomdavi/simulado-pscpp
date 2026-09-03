import EditorClient from './EditorClient';
import './editor.css';

export const metadata = {
  title: 'Editor visual | ESTIBORDO',
  robots: { index: false, follow: false },
};

export default function SiteEditorPage() {
  return <EditorClient />;
}