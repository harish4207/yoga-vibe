import Razorpay from 'razorpay';

if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  throw new Error('Razorpay credentials are not defined in environment variables');
}

console.log('Razorpay Key ID being used:', process.env.RAZORPAY_KEY_ID);
console.log('Razorpay Key Secret being used:', process.env.RAZORPAY_KEY_SECRET ? '********' : 'Undefined'); // Mask secret for security

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export default razorpay; 