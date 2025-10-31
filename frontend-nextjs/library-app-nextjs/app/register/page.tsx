'use client';

import { useAuth } from '@/lib/localAuth';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const res = await fetch('/api/auth/local/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (res.ok) {
      await login(email, password).catch(() => { });
      router.push('/home');
    } else {
      const msg = (await res.json()).message || 'Registration failed';
      setError(msg);
    }
  };

  return (
    <Box sx={{ height: '100vh', width: '100vw', overflowX: 'hidden', bgcolor: 'white' }}>
      <Box sx={{ display: 'flex', height: '100%' }}>
        <Box
          sx={{
            flex: 1,
            display: { xs: 'none', lg: 'block' },
            position: 'relative',
            backgroundImage: "url('/Images/PublicImages/library-background-image-signup-page.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <Box sx={{ position: 'absolute', inset: 0, bgcolor: 'rgba(0,0,0,0.55)' }} />
          <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center' }}>
            <div className="px-10 text-white">
              <h2 className="text-2xl lg:text-3xl font-bold mb-4">Tạo tài khoản để bắt đầu sử dụng CFC Books</h2>
              <ul className="space-y-3 text-sm lg:text-base">
                <li className="flex items-start gap-2"><span className="text-emerald-400 mt-0.5">✓</span><span>Lưu lịch sử mượn trả và đánh giá sách</span></li>
                <li className="flex items-start gap-2"><span className="text-emerald-400 mt-0.5">✓</span><span>Nhận gợi ý theo thói quen đọc</span></li>
                <li className="flex items-start gap-2"><span className="text-emerald-400 mt-0.5">✓</span><span>Theo dõi tác giả yêu thích</span></li>
                <li className="flex items-start gap-2"><span className="text-emerald-400 mt-0.5">✓</span><span>Truy cập kho thư viện số của CFC</span></li>
              </ul>
            </div>
          </Box>
        </Box>
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', px: 2 }}>
          <div className="w-full max-w-sm md:max-w-md mx-auto">
            <Button variant="outlined" onClick={() => router.push('/home')} className="mb-4">← Back to Home</Button>
            <Card className="shadow-xl rounded-2xl w-full">
              <CardContent className="p-6">
                <Box className="flex flex-col items-center text-center">
                  <Avatar className="bg-indigo-600 mb-3"><LockOutlinedIcon /></Avatar>
                  <Typography component="h1" variant="h5" className="font-semibold">Create account</Typography>
                </Box>
                {error && (
                  <Box className="mt-4">
                    <div className="rounded-md bg-red-50 p-3 text-sm text-red-700 border border-red-200">{error}</div>
                  </Box>
                )}
                <Box component="form" onSubmit={onSubmit} noValidate className="mt-5 space-y-4">
                  <TextField label="Email" type="email" fullWidth value={email} onChange={(e) => setEmail(e.target.value)} required />
                  <TextField label="Password" type="password" fullWidth value={password} onChange={(e) => setPassword(e.target.value)} required />
                  <Button type="submit" variant="contained" fullWidth className="!bg-indigo-600 hover:!bg-indigo-700 py-2">Register</Button>
                  <div className="text-center text-sm text-gray-600">Đã có tài khoản? <a href="/login" className="text-indigo-600 hover:underline">Đăng nhập</a></div>
                </Box>
              </CardContent>
            </Card>
          </div>
        </Box>
      </Box>
    </Box>
  );
}


