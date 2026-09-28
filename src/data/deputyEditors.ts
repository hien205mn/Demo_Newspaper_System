export interface DeputyEditorInfo {
  id: string;
  name: string;
  title: string;
  avatar: string;
  phone: string;
  email: string;
  assignedDomains: [string, string] | [string]; // Business rule: 1-2 lĩnh vực đảm nhiệm
  bio: string;
  department: string;
  reviewCount: number;
}

export const DEPUTY_EDITORS: DeputyEditorInfo[] = [
  {
    id: 'DEP-01',
    name: 'Trần Quang Huy',
    title: 'Phó Tổng Biên Tập Thường Trực',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    phone: '0903.228.911',
    email: 'quanghuy.deputy@toasoan.vn',
    assignedDomains: ['Giao thông & Hạ tầng đô thị', 'Trật tự xây dựng dân sinh'],
    department: 'Ban Chỉ đạo Nội dung Giao thông & Hạ tầng',
    bio: 'Hơn 18 năm công tác báo chí, phụ trách chỉ đạo tuyến bài an toàn giao thông, kết nối hạ tầng và trật tự đô thị dân sinh.',
    reviewCount: 42,
  },
  {
    id: 'DEP-02',
    name: 'TS. Vũ Đình Toàn',
    title: 'Phó Tổng Biên Tập Chuyên Môn',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80',
    phone: '0912.884.331',
    email: 'dinhtoan.deputy@toasoan.vn',
    assignedDomains: ['Môi trường & Thiên tai', 'Ứng phó khẩn cấp'],
    department: 'Ban Chỉ đạo Phòng chống Thiên tai & Sự cố Môi trường',
    bio: 'Tiến sĩ Khí tượng Thủy văn, nguyên Trưởng ban Khoa học & Đời sống, phụ trách chỉ đạo đưa tin cứu hộ cứu nạn, thiên tai và an toàn môi trường.',
    reviewCount: 38,
  },
  {
    id: 'DEP-03',
    name: 'ThS. Luật sư Lê Kim Dung',
    title: 'Phó Tổng Biên Tập Pháp Chế',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    phone: '0988.441.552',
    email: 'kimdung.deputy@toasoan.vn',
    assignedDomains: ['Khiếu nại - Tố cáo', 'Pháp luật & Quyền dân sinh'],
    department: 'Ban Bạn Đọc & Trợ giúp Pháp lý Dân sinh',
    bio: 'Thạc sĩ Luật học, phụ trách thẩm định tính pháp lý hồ sơ khiếu nại, tranh chấp đất đai, tiêu cực dân sinh và bảo vệ bí mật nguồn tin.',
    reviewCount: 51,
  },
  {
    id: 'DEP-04',
    name: 'Nguyễn Văn Thắng',
    title: 'Phó Tổng Biên Tập Thời Sự',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    phone: '0904.778.991',
    email: 'vanthang.deputy@toasoan.vn',
    assignedDomains: ['Kinh tế - Đời sống dân sinh', 'Tiêu cực xã hội & Y tế'],
    department: 'Ban Thời sự & Điều tra Dân sinh',
    bio: 'Nhà báo cao cấp, phụ trách mảng điều tra kinh tế đời sống, vệ sinh an toàn thực phẩm và các vấn đề an sinh xã hội cấp bách.',
    reviewCount: 29,
  },
];

/**
 * Tìm Phó Tổng Biên Tập phụ trách dựa trên nội dung và phân loại của vụ việc
 * Tuân thủ business rule: mỗi Phó TBT đảm nhiệm 1-2 lĩnh vực chuyên môn cụ thể.
 */
export function getDeputyForCategory(category?: string, title?: string, desc?: string): DeputyEditorInfo {
  const text = `${category || ''} ${title || ''} ${desc || ''}`.toLowerCase();
  
  // 1. Môi trường & Thiên tai / Cứu nạn
  if (
    text.includes('sạt lở') || 
    text.includes('mưa') || 
    text.includes('lũ') || 
    text.includes('bão') || 
    text.includes('môi trường') || 
    text.includes('khói') || 
    text.includes('hóa chất') || 
    text.includes('cháy') || 
    text.includes('rác') ||
    text.includes('nước thải')
  ) {
    return DEPUTY_EDITORS[1]; // TS. Vũ Đình Toàn
  }

  // 2. Khiếu nại, Pháp luật & Quyền dân sinh
  if (
    text.includes('khiếu nại') || 
    text.includes('pháp luật') || 
    text.includes('đất đai') || 
    text.includes('tranh chấp') || 
    text.includes('tố cáo') || 
    text.includes('sai phạm') ||
    text.includes('chính quyền') ||
    text.includes('đền bù')
  ) {
    return DEPUTY_EDITORS[2]; // ThS. Luật sư Lê Kim Dung
  }

  // 3. Kinh tế, Thực phẩm, Tiêu cực xã hội & Y tế
  if (
    text.includes('thực phẩm') || 
    text.includes('kinh tế') || 
    text.includes('lừa đảo') || 
    text.includes('thuốc giả') || 
    text.includes('chợ') || 
    text.includes('tiêu cực') || 
    text.includes('bệnh viện') || 
    text.includes('y tế')
  ) {
    return DEPUTY_EDITORS[3]; // Nguyễn Văn Thắng
  }

  // 4. Mặc định: Giao thông & Hạ tầng đô thị (cầu đường, ổ gà, kẹt xe, tai nạn)
  return DEPUTY_EDITORS[0]; // Trần Quang Huy
}
