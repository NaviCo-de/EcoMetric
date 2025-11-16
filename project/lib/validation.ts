import { z } from 'zod';

export const registerSchema = z.object({
    nama: z.string().min(1, { message: 'Nama wajib diisi'}),
    email: z.string().email({ message: 'Email tidak valid' }),
    password: z.string().min(6, { message: 'Minimal 6 karakter' }),
    confirmPassword: z.string().min(1, { message: 'Confirm password wajib diisi'}),
});

export const loginSchema = z.object({
    email: z.string().email({ message: 'Email tidak valid' }),
    password: z.string().min(1, { message: 'Password wajib diisi' }),
});

export const forgetPasswordSchema = z.object({
  email: z.string().email({ message: "Email tidak valid" })
});

export const verifyOtpSchema = z.object({
  token: z.string().min(6, { message: "OTP Wajib diisi semua"}),
})

export const resetPasswordSchema = z.object({
  password: z.string().min(1, { message: "Password wajib diisi" }),
  confirmPassword: z.string().min(1, { message: "Confirm Password wajib diisi" })
});

export const EQSSchema = z.object({
  "air": z.object({
    "CO_GT": z.number(),
    "NO2_GT": z.number(),
    "PT08_S5_O3": z.number(),
    "T": z.number(),
    "RH": z.number(),
    "AH": z.number(),
  }),
  "water": z.object({
    "Temp": z.number(),
    "Turbidity_cm": z.number(),
    "DO_mg_L": z.number(),
    "BOD_mg_L": z.number(),
    "CO2": z.number(),
    "pH": z.number(),
    "Alkalinity_mg_L": z.number(),
    "Hardness_mg_L": z.number(),
    "Calcium_mg_L": z.number(),
    "Ammonia_mg_L": z.number(),
    "Nitrite_mg_L": z.number(),
    "Phosphorus_mg_L": z.number(),
    "H2S_mg_L": z.number(),
    "Plankton_No_L": z.number(),
  }),
  "soil": z.object({
    "N": z.number(),
    "P": z.number(),
    "K": z.number(),
    "ph": z.number(),
    "EC": z.number(),
    "S": z.number(),
    "Cu": z.number(),
    "Fe": z.number(),
    "Mn": z.number(),
    "Zn": z.number(),
    "B": z.number(),
  }),
});