// app/login/page.jsx  ← серверный компонент (без "use client")
import AuthScreen from '@/components/Auth/AuthScreen';

export default function LoginPage({ searchParams }) {
  // читаем ?from=korzina (или null)
  const search = typeof searchParams?.from === 'string' ? searchParams.from : null;
  return <AuthScreen search={search} />;
}
