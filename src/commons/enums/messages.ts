export enum PublicMessage {
  SendOtp = "کد ورود ارسال شد.",
  LoggedIn = "با موفقیت وارد حساب کاربری خود شدید.",
  Created = "ذخیره با موفقیت انجام شد",
  OkResponse = "عملیات با موفقیت انجام شد.",
  Updated = "ویرایش با موفقیت انجام شد.",
  Deleted = "حذف با موفقیت انجام شد.",
}

export enum BadRequestMessage {
  InvalidData = "دیتاهای ارسالی معتبر  نمیباشند",
  ExpiredOtpCode = "خطا. کد فعال سازی منقضی شده است.",
  NotExpiredOtpCode = "خطا. کد فعال سازی شما هنوز معتبر است. لطفا بعد از 2 دقیقه درخواست را ارسال کنید.",
}

export enum AuthMessage {
  TryAgain = "خطا در احراز هویت. دوباره تلاش کنید.",
  NotFoundUser = "کاربری با این مشخصات یافت نشد",
  UnAuthorize = "احراز هویت انجام نشد. مجدد وارد حساب خود شوید",
  AlreadyExistUser = "کاربری با این مشخصات وجود دارد.",
  ExpiredCode = "کد تایید منقضی شده است. مجددا تلاش کنید.",
  IncorrectCode = "کد اشتباه است. مجددا تلاش کنید",
  LoginIsRequired = "وارد حساب کاربری خود شوید.",
}

export enum NotFoundMessage {
  NotFoundData = "موردی یافت نشد.",
  NotFoundStorefront = "فروشگاهی یافت نشد.",
  NotFoundStorefrontProduct = "محصولی در فروشگاه یافت نشد.",
  NotFoundLocation = "لوکیشن یافت نشد.",
  NotFoundFile = "فایل موردنظر یافت نشد.",
}

export enum ConflictMessage {
  ExistCategoryTitle = "عنوان وارد شده تکراری است",
  ExistAuthorName = "نویسنده تکراری میباشد",
}

export enum ValidationMessage {
  InvalidImageFormat = "فرمت تصویر انتخاب شده باید از نوع jpg,png باشد",
}
