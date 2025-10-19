// components/Form/MaskPhone/PhoneInput.js
const PhoneInput = ({ value, onChange, setAlertText, setAlertActive, bg }) => {
	const formatPhoneNumber = (input) => {
		const digits = input.replace(/\D/g, '');
		if (!digits.startsWith('375')) {
			return '+375 ';
		}
		let formatted = `+375`;
		if (digits.length > 3) formatted += ` ${digits.slice(3, 5)}`;
		if (digits.length > 5) formatted += ` ${digits.slice(5, 8)}`;
		if (digits.length > 8) formatted += `-${digits.slice(8, 10)}`;
		if (digits.length > 10) formatted += `-${digits.slice(10, 12)}`;
		return formatted;
	};

	const handleChange = (e) => {
		let formatted = formatPhoneNumber(e.target.value);
		const digits = formatted.replace(/\D/g, '');
		const operatorCode = digits.slice(3, 5);
		const validOperators = ["29", "33", "44", "25"];

		if (digits.length >= 5 && !validOperators.includes(operatorCode)) {
			setAlertText('Введите код оператора 29, 44, 33, 25');
			setAlertActive(true);
			setTimeout(() => setAlertActive(false), 3000);
			formatted = '+375 ';
		}

		onChange(formatted);
	};

	return (
		<input
			type="text"
			value={value}
			onChange={handleChange}
			placeholder="+375 xx xxx-xx-xx"
			className={`input input-bordered input-md ${bg ? 'bg-white/10' : ''} w-full`}
			required
			aria-label="Ввод номера телефона"
		/>
	);
};

export default PhoneInput;