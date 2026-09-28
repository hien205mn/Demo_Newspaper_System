import { ImpactCategory, PriorityLevel } from '../types';

export const IMPACT_CATEGORIES: ImpactCategory[] = [
  {
    id: 'locationScope',
    title: '1. Khu vực xảy ra (Location Scope)',
    order: 1,
    options: [
      {
        value: 10,
        label: 'Địa phương / Phường, Xã',
        sublabel: '+10 điểm',
        description: 'Vụ việc chỉ gói gọn trong một tổ dân phố, thôn xóm, phường/xã đơn lẻ, không có nguy cơ lây lan diện rộng.',
      },
      {
        value: 20,
        label: 'Cấp Quận / Huyện / Thị xã',
        sublabel: '+20 điểm',
        description: 'Tác động bao trùm toàn bộ một quận, huyện hoặc khu đô thị tập trung.',
      },
      {
        value: 30,
        label: 'Cấp Tỉnh / Thành phố',
        sublabel: '+30 điểm',
        description: 'Vụ việc diễn ra trên diện rộng toàn tỉnh/thành phố hoặc tác động trực tiếp đến trung tâm đô thị lớn.',
      },
      {
        value: 40,
        label: 'Liên tỉnh / Toàn quốc',
        sublabel: '+40 điểm',
        description: 'Vụ việc có tính chất liên vùng, trải dài qua nhiều tỉnh/thành phố hoặc tác động đến cơ sở hạ tầng, huyết mạch của cả nước.',
      },
    ],
  },
  {
    id: 'affectedPopulation',
    title: '2. Quy mô số người bị ảnh hưởng (Affected Population)',
    order: 2,
    options: [
      {
        value: 10,
        label: 'Cá nhân / Hẹp (< 10 người)',
        sublabel: '+10 điểm',
        description: 'Tranh chấp nội bộ nhỏ, mâu thuẫn cá nhân, thiệt hại giới hạn trong vài cá nhân cụ thể.',
      },
      {
        value: 20,
        label: 'Quy mô nhỏ (10 – 100 người)',
        sublabel: '+20 điểm',
        description: 'Ảnh hưởng trực tiếp đến một khu dân cư nhỏ, một tổ dân phố, tập thể người lao động hoặc một lớp học.',
      },
      {
        value: 30,
        label: 'Quy mô vừa (100 – 1.000 người)',
        sublabel: '+30 điểm',
        description: 'Tác động đến một cụm chung cư lớn, nhiều trường học, khu công nghiệp hoặc toàn bộ dân cư một xã/phường.',
      },
      {
        value: 40,
        label: 'Quy mô lớn (> 1.000 người / Cộng đồng)',
        sublabel: '+40 điểm',
        description: 'Thảm họa, ngập lụt, ô nhiễm nguồn nước sạch, dịch bệnh, lừa đảo công nghệ cao đe dọa hàng ngàn người dân.',
      },
    ],
  },
  {
    id: 'severity',
    title: '3. Loại tính chất vấn đề (Severity & Nature)',
    order: 3,
    options: [
      {
        value: 10,
        label: 'Đời sống / Ý kiến thường nhật',
        sublabel: '+10 điểm',
        description: 'Phản ánh dân sinh cơ bản: hỏng đường nhỏ, ngập úng nhẹ cục bộ, tiếng ồn sinh hoạt, thủ tục hành chính thông thường.',
      },
      {
        value: 20,
        label: 'Tranh chấp / Thiệt hại kinh tế vừa',
        sublabel: '+20 điểm',
        description: 'Khiếu nại đền bù, tranh chấp đất đai cục bộ, gian lận thương mại quy mô cơ sở, vi phạm trật tự xây dựng.',
      },
      {
        value: 35,
        label: 'Ô nhiễm / An toàn / Rủi ro pháp lý cao',
        sublabel: '+35 điểm',
        description: 'Ô nhiễm môi trường xả thải công nghiệp, an toàn vệ sinh thực phẩm diện rộng, tai nạn giao thông nghiêm trọng, khiếu kiện phức tạp.',
      },
      {
        value: 50,
        label: 'Thiệt hại nhân mạng / Khủng hoảng / An ninh',
        sublabel: '+50 điểm',
        description: 'Thảm họa tự nhiên (sạt lở, vỡ đập), cháy nổ thiệt hại về người, án mạng, tin gây hoang mang bất ổn chính trị - xã hội sâu rộng.',
      },
    ],
  },
];

export function calculatePriority(totalScore: number): {
  level: PriorityLevel;
  name: string;
  min: number;
  max: number;
  color: string;
  bgLight: string;
  borderColor: string;
  requiresFieldReporter: boolean;
  standard: string;
  workflowSummary: string;
} {
  if (totalScore >= 105) {
    return {
      level: 'BREAKING',
      name: 'Mức 4: BREAKING (Khẩn cấp)',
      min: 105,
      max: 130,
      color: 'text-red-600',
      bgLight: 'bg-red-50',
      borderColor: 'border-red-300',
      requiresFieldReporter: true,
      standard: 'Sự việc đặc biệt nghiêm trọng, chấn động dư luận, đe dọa sinh mạng hoặc nguy cơ khủng hoảng quy mô liên tỉnh/toàn quốc.',
      workflowSummary: 'Broadcast khẩn tới CTV khu vực tác nghiệp thu thập bằng chứng ➔ Phó TBT thẩm định khẩn ➔ Trực tiếp Tổng biên tập (EIC) ra quyết định duyệt hoặc gỡ bỏ (Có thể kích hoạt luồng giải mật danh tính người báo tin ẩn danh bằng OTP nếu cần).',
    };
  }
  
  if (totalScore >= 80) {
    return {
      level: 'HIGH',
      name: 'Mức 3: HIGH (Cao)',
      min: 80,
      max: 100,
      color: 'text-orange-600',
      bgLight: 'bg-orange-50',
      borderColor: 'border-orange-300',
      requiresFieldReporter: true,
      standard: 'Vụ việc phức tạp, diện tác động lớn (cấp tỉnh, trên ngàn người hoặc thiệt hại tài sản lớn).',
      workflowSummary: 'Bắt buộc có bằng chứng hiện trường. BTV phát lệnh tác nghiệp (field_assignments) điều phối CTV đi xác minh ➔ BTV biên tập bài thành phẩm của CTV ➔ Phó TBT thẩm định và ESCALATE lên Tổng biên tập duyệt cuối.',
    };
  }
  
  if (totalScore >= 55) {
    return {
      level: 'MEDIUM',
      name: 'Mức 2: MEDIUM (Trung bình)',
      min: 55,
      max: 75,
      color: 'text-amber-600',
      bgLight: 'bg-amber-50',
      borderColor: 'border-amber-300',
      requiresFieldReporter: false,
      standard: 'Quy mô vừa (cấp huyện/tỉnh, vài trăm người), có dấu hiệu sai phạm cần lưu ý.',
      workflowSummary: 'BTV rà soát hồ sơ ➔ Phó Tổng biên tập phụ trách lĩnh vực kiểm duyệt chuyên môn ➔ Phê duyệt xuất bản (Không bắt buộc CTV hiện trường).',
    };
  }
  
  return {
    level: 'LOW',
    name: 'Mức 1: LOW (Thấp)',
    min: 30,
    max: 50,
    color: 'text-emerald-600',
    bgLight: 'bg-emerald-50',
    borderColor: 'border-emerald-300',
    requiresFieldReporter: false,
    standard: 'Ảnh hưởng nhỏ, tính chất đời sống, không có rủi ro pháp lý hay khủng hoảng.',
    workflowSummary: 'BTV biên tập ➔ Đúng 1 Phó Tổng biên tập phụ trách lĩnh vực duyệt (APPROVE) ➔ Xuất bản (READY_FOR_PUBLISHING).',
  };
}

export const VIETNAM_REGIONS = [
  {
    province: 'Hà Nội',
    districts: ['Ba Đình', 'Hoàn Kiếm', 'Cầu Giấy', 'Đống Đa', 'Nam Từ Liêm', 'Bắc Từ Liêm', 'Hà Đông', 'Long Biên'],
  },
  {
    province: 'TP. Hồ Chí Minh',
    districts: ['Quận 1', 'Quận 3', 'Quận 7', 'Bình Thạnh', 'Tân Bình', 'Thủ Đức', 'Gò Vấp', 'Bình Tân'],
  },
  {
    province: 'Đà Nẵng',
    districts: ['Hải Châu', 'Thanh Khê', 'Sơn Trà', 'Ngũ Hành Sơn', 'Liên Chiểu', 'Cẩm Lệ'],
  },
  {
    province: 'Hải Phòng',
    districts: ['Hồng Bàng', 'Ngô Quyền', 'Lê Chân', 'Hải An', 'Kiến An', 'Thủy Nguyên'],
  },
  {
    province: 'Cần Thơ',
    districts: ['Ninh Kiều', 'Bình Thủy', 'Cái Răng', 'Ô Môn', 'Thốt Nốt'],
  },
  {
    province: 'Lâm Đồng',
    districts: ['TP. Đà Lạt', 'TP. Bảo Lộc', 'Đức Trọng', 'Lạc Dương', 'Di Linh'],
  },
  {
    province: 'Quảng Ninh',
    districts: ['TP. Hạ Long', 'TP. Cẩm Phả', 'TP. Uông Bí', 'TP. Móng Cái'],
  }
];

export const MOCK_REPORTERS = [
  { id: 'CTV-01', name: 'Nguyễn Văn Hùng', email: 'hung.reporter@press.vn', phone: '0912.345.678', region: 'Hà Nội', status: 'Sẵn sàng tác nghiệp', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
  { id: 'CTV-02', name: 'Trần Thị Mai', email: 'mai.tran@press.vn', phone: '0988.123.456', region: 'TP. Hồ Chí Minh', status: 'Sẵn sàng tác nghiệp', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80' },
  { id: 'CTV-03', name: 'Lê Hoàng Nam', email: 'nam.le@press.vn', phone: '0903.888.999', region: 'Đà Nẵng', status: 'Sẵn sàng tác nghiệp', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
  { id: 'CTV-04', name: 'Vũ Quốc Bảo', email: 'bao.vu@press.vn', phone: '0977.555.222', region: 'Lâm Đồng', status: 'Đang ở hiện trường', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80' },
  { id: 'CTV-05', name: 'Đoàn Phương Linh', email: 'linh.doan@press.vn', phone: '0933.111.444', region: 'Hải Phòng', status: 'Sẵn sàng tác nghiệp', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80' },
];
