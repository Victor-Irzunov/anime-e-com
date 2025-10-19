"use client"
import { registration } from '@/http/userAPI';
import { useRouter } from "next/navigation";
import { useState } from 'react';
import { RiEyeLine, RiEyeOffLine } from 'react-icons/ri';

const RegistrationForm = ({ setIsActive, search }) => {
  const [isActiveAlert, setIsActiveAlert] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleTogglePassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log('Данные для сохранения в базе данных:', formData);
    registration(formData)
      .then(data => {
        if (data) {
          setIsActiveAlert(true)
          setFormData({
            email: '',
            password: '',
          });
        }
        setTimeout(() => {
          setIsActiveAlert(false)
          if (search === 'korzina') {
            router.push('/korzina')
          } else {
            router.push('/')
          }
        }, 2000)
      })

  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="form-control mt-3 relative">
          <label className="label">
            <span className="label-text">Логин (почта)</span>
            <span className="label-text-alt">Обязательное поле</span>
          </label>
          <input
            type="text"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="input input-bordered"
            placeholder="Введите ваш логин (почту)"
            required
          />
        </div>

        <div className="form-control mt-3 relative">
          <label className="label">
            <span className="label-text">Пароль</span>
            <span className="label-text-alt">Обязательное поле</span>
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="input input-bordered pr-10 w-full"
              placeholder="Введите пароль"
              required
            />
            <button
              type="button"
              onClick={handleTogglePassword}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showPassword ? <RiEyeOffLine /> : <RiEyeLine />}
            </button>
          </div>
        </div>

        <div className="form-control mt-6">
          <button type="submit" className="btn btn-primary">
            Зарегистрироваться
          </button>
        </div>
      </form>
      <div className='mt-5'>
        Есть аккаунт? <button
          className="btn btn-link"
          onClick={() => setIsActive(true)}
        >
          Войти
        </button>
      </div>

      {
        isActiveAlert ?
          <div role="alert" className="alert alert-success absolute top-4 left-0 right-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span>Вы зарегистрированы!</span>
          </div>
          :
          null
      }
    </>
  );
};

export default RegistrationForm;
