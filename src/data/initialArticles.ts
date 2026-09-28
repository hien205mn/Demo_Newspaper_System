import { EditorialArticle } from '../types';

export const INITIAL_EDITORIAL_ARTICLES: EditorialArticle[] = [
  // ==================== 1. CỘNG TÁC VIÊN (CTV) ====================
  {
    id: 'art-ctv-001',
    code: 'CTV-2026-001',
    sourceType: 'CTV',
    title: 'Hiện trường sạt lở đèo Bảo Lộc: Hàng nghìn khối đất đá tràn xuống Quốc lộ 20, lực lượng cứu hộ phong tỏa xuyên đêm',
    sapo: 'Trực tiếp từ hiện trường đèo Bảo Lộc (Lâm Đồng), cộng tác viên ghi nhận tình trạng sạt trượt đất nghiêm trọng sau cơn mưa lớn kéo dài. Toàn bộ tuyến quốc lộ huyết mạch lên Đà Lạt bị chia cắt hoàn toàn trong đêm 26/9.',
    content: `Theo ghi nhận của CTV hiện trường tại Km104+200 Quốc lộ 20 (đoạn qua đèo Bảo Lộc, địa phận xã Đại Lào, TP Bảo Lộc), vào khoảng 21h30 tối qua, vách taluy dương bất ngờ đổ sập, kéo theo hàng ngàn tấn đất đá, cây rừng cổ thụ chắn ngang toàn bộ 2 làn đường.

Ghi nhận tại thực địa, đất bùn nhão có đoạn ngập sâu hơn 1,5m, chôn vùi một phần đuôi xe tải đông lạnh đang lưu thông theo hướng TP.HCM - Đà Lạt. Rất may tài xế và phụ xe đã kịp thời bung cửa tháo chạy an toàn trước khi khối đất thứ hai tiếp tục đổ xuống.

Đến 02h00 sáng nay, lực lượng Cảnh sát Giao thông Công an tỉnh Lâm Đồng phối hợp cùng Đội Phòng cháy chữa cháy và Cứu nạn cứu hộ khu vực 3 đã huy động 4 xe múc chuyên dụng, 2 xe ủi và hàng chục chiến sĩ khẩn trương dọn dẹp hiện trường. Đoạn đèo hiện đã được cắm biển cảnh báo nguy hiểm, lực lượng chức năng phân luồng giao thông từ xa qua hướng đèo Con Ó (huyện Đạ Tẻh).

Thời tiết tại khu vực đèo vẫn đang có mưa rải rác, sương mù dày đặc tiềm ẩn nguy cơ sạt lở thứ cấp rất cao. Lực lượng cứu nạn khuyến cáo người dân không nên cố tình vượt qua chốt phong tỏa.`,
    category: 'Thời sự - Thiên tai',
    tags: ['Sạt lở đèo Bảo Lộc', 'Quốc lộ 20', 'Cứu hộ khẩn cấp', 'Giao thông Lâm Đồng'],
    authorName: 'Vũ Quốc Bảo',
    authorPenName: 'Quốc Bảo (CTV Lâm Đồng)',
    authorTitle: 'Cộng Tác Viên Hiện Trường',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    authorOrganization: 'Mạng lưới CTV Tây Nguyên & Duyên hải Nam Trung Bộ',
    authorPhone: '0978.334.556',
    authorEmail: 'bao.vu@press.vn',
    submittedAt: '2026-09-27 06:15',
    status: 'PENDING_REVIEW',
    royaltyTier: 'TIER_A',
    royaltyAmount: 1200000,
    relatedSubmissionCode: 'TN-2026-9812',
    factCheckScore: 98,
    factCheckNotes: 'Ảnh chụp có tọa độ GPS chính xác tại Km104 đèo Bảo Lộc; đã đối chiếu biên bản xác minh của CSGT tỉnh Lâm Đồng.',
    attachments: [
      {
        id: 'att-ctv-1',
        name: 'sat_lo_deo_bao_loc_01.jpg',
        url: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=800&auto=format&fit=crop&q=80',
        caption: 'Hiện trường khối đất đá tràn lấp mặt đường đèo Bảo Lộc lúc nửa đêm',
        type: 'image',
      },
      {
        id: 'att-ctv-2',
        name: 'xe_cuu_ho_khac_phuc.jpg',
        url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
        caption: 'Xe cơ giới tích cực giải phóng mặt đường trong điều kiện mưa mù',
        type: 'image',
      },
    ],
  },
  {
    id: 'art-ctv-002',
    code: 'CTV-2026-002',
    sourceType: 'CTV',
    title: 'Hiểm họa cầu treo xuống cấp nối 3 bản vùng cao: Hàng trăm học sinh ngày ngày đu bè nứa qua suối dữ',
    sapo: 'Cây cầu treo duy nhất nối các bản Ón, Yên Hợp và Mò O Ồ Ồ đã đứt cáp neo và mục nát mặt ván suốt 6 tháng qua. Để kịp giờ tới trường, các em nhỏ và người dân đành phải đánh cược tính mạng trên những chiếc bè nứa tự chế chòng chành giữa dòng nước xiết.',
    content: `Cầu treo dân sinh vượt suối Nước Chè được xây dựng từ năm 2012, là con đường độc đạo phục vụ việc đi lại và giao thương của hơn 420 hộ đồng bào dân tộc thiểu số tại xã vùng cao Thượng Trạch.

Tuy nhiên, trận lũ quét hồi tháng 3/2026 đã giật đứt một nhánh cáp néo chịu lực phía bờ tả, khiến mặt cầu nghiêng hơn 35 độ. Hệ thống lan can sắt bị gỉ sét gãy vụn, các tấm gỗ lát mặt cầu đã mục rỗng lộ ra những khoảng trống tử thần nhìn thẳng xuống lòng suối sâu cuồn cuộn đá ngầm.

Ông Cao Văn Thắng, Trưởng bản Mò O Ồ Ồ cho biết: "Mỗi ngày có gần 180 cháu học sinh từ mầm non đến trung học phải qua suối đi học. Những ngày mưa to nước dâng cao, bà con phải buộc dây thừng hai bên bờ kéo bè nứa đưa từng cháu qua. Đã có 2 trường hợp người lớn ngã lật bè trôi gần 50 mét mới được người dân vớt lên".

Mặc dù chính quyền xã đã cắm biển cấm phương tiện cơ giới qua cầu, nhưng vì nhu cầu mưu sinh và học tập cấp thiết, người dân nơi đây vẫn phải hàng ngày đối mặt với hiểm nguy rình rập. Người dân tha thiết mong mỏi các cấp ban ngành sớm bố trí nguồn vốn sửa chữa hoặc xây dựng cây cầu kiên cố.`,
    category: 'Đời sống - Dân sinh',
    tags: ['Cầu treo xuống cấp', 'Học sinh vùng cao', 'Nguy hiểm suối lũ', 'An toàn giao thông'],
    authorName: 'Hoàng Thị Loan',
    authorPenName: 'Hoàng Loan (Sơn La)',
    authorTitle: 'Cộng Tác Viên Vùng Cao',
    authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    authorOrganization: 'Mạng lưới CTV Tây Bắc',
    authorPhone: '0983.412.981',
    authorEmail: 'hoangloan.ctv@toasoan.vn',
    submittedAt: '2026-09-26 14:30',
    status: 'EDITING',
    royaltyTier: 'TIER_B',
    royaltyAmount: 900000,
    editorNote: 'Đang bổ sung thông tin phản hồi từ Phòng Kinh tế & Hạ tầng huyện về kế hoạch duy tu.',
    factCheckScore: 92,
    factCheckNotes: 'Đã có video xác thực cảnh phụ huynh kéo bè nứa qua suối; phỏng vấn đúng đối tượng chính quyền cơ sở.',
    attachments: [
      {
        id: 'att-ctv-201',
        name: 'cau_treo_nghieng_nguy_hiem.jpg',
        url: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32f?w=800&auto=format&fit=crop&q=80',
        caption: 'Mặt cầu treo nghiêng dốc nguy hiểm, nhiều mảng ván mục nát bong tróc',
        type: 'image',
      },
    ],
  },
  {
    id: 'art-ctv-003',
    code: 'CTV-2026-003',
    sourceType: 'CTV',
    title: 'Phát hiện đường ống xả thải ngầm đen ngòm xả trộm ra rạch Thầy Cai lúc rạng sáng',
    sapo: 'Sau nhiều đêm mật phục, CTV phối hợp người dân phát hiện cống ngầm đường kính 600mm xả nước thải bốc mùi hóa chất nồng nặc ra nguồn nước tưới tiêu nông nghiệp tại khu vực giáp ranh cụm công nghiệp.',
    content: `Vào khoảng 01h15 sáng 25/9, tại bờ kênh rạch Thầy Cai (khu vực giáp ranh giữa huyện Củ Chi và huyện Đức Hòa), dòng nước đen đặc quánh kèm theo bọt trắng xóa bất ngờ sủi bọt cuồn cuộn từ miệng cống ngầm ẩn dưới tán cây rậm rạp.

Theo phản ánh của các hộ dân trồng rau sạch xung quanh, hiện tượng này đã diễn ra âm thầm suốt hơn 2 tháng qua. "Cứ cách 2 đến 3 ngày, vào khoảng từ 1 giờ đến 3 giờ sáng, họ lại mở van xả. Mùi nồng như mùi thuốc nhuộm và axit xộc thẳng vào mũi gây đau đầu, buồn nôn. Nước kênh bơm lên tưới cây khiến hoa màu héo rũ hàng loạt", ông T.V.D (58 tuổi, ngụ ấp 3) bức xúc phản ánh.

CTV đã dùng bình thủy tinh chuyên dụng lấy mẫu nước tại vị trí miệng cống xả lúc 01h40. Mẫu nước có màu tím đen sẫm, độ pH đo nhanh bằng giấy quỳ hiển thị tính axit mạnh (pH xấp xỉ 3.5), có váng dầu nhờn bề mặt. 

Hiện toàn bộ hình ảnh, tọa độ định vị và mẫu nước đã được đóng niêm phong để gửi cơ quan Cảnh sát Phòng chống Tội phạm về Môi trường thẩm định xử lý theo đúng quy định.`,
    category: 'Môi trường - Đời sống',
    tags: ['Xả thải trộm', 'Ô nhiễm môi trường', 'Kênh rạch', 'Hóa chất độc hại'],
    authorName: 'Nguyễn Văn Hùng',
    authorPenName: 'Hùng Nguyễn (CTV Đông Nam Bộ)',
    authorTitle: 'Cộng Tác Viên Hiện Trường',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    authorOrganization: 'Mạng lưới CTV TP.HCM & Đông Nam Bộ',
    authorPhone: '0913.882.114',
    authorEmail: 'hung.nguyen@ctv.vn',
    submittedAt: '2026-09-25 09:20',
    status: 'TRANSFERRED_TO_DEPUTY',
    royaltyTier: 'TIER_A',
    royaltyAmount: 1500000,
    editorNote: 'Hồ sơ bằng chứng rất sắc bén, đề xuất Phó Tổng biên tập cho xuất bản và chuyển văn bản tới Sở TN&MT.',
    factCheckScore: 96,
    factCheckNotes: 'Mẫu vật và video quay bằng camera chuyên dụng có hiển thị timestamp chính xác rạng sáng.',
    attachments: [
      {
        id: 'att-ctv-301',
        name: 'nuoc_thai_den_ngom.jpg',
        url: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=800&auto=format&fit=crop&q=80',
        caption: 'Dòng nước thải sủi bọt trắng xóa bốc mùi hóa chất nồng nặc tràn ra dòng kênh sinh hoạt',
        type: 'image',
      },
    ],
  },

  // ==================== 2. CHUYÊN GIA (EXPERT) ====================
  {
    id: 'art-exp-101',
    code: 'EXP-2026-101',
    sourceType: 'EXPERT',
    title: 'Giải pháp căn cơ chống ngập úng đô thị trước biến đổi khí hậu cực đoan: Vì sao các "rốn ngập" vẫn tái diễn sau hàng nghìn tỷ đầu tư?',
    sapo: 'Phân tích chuyên sâu của PGS. TS Trần Đình Khiêm về nghịch lý càng chống ngập càng ngập tại các đô thị lớn; chỉ rõ nguyên nhân bê tông hóa quá đà, cốt nền chắp vá và đề xuất mô hình "đô thị xốp" (Sponge City) thích ứng tự nhiên.',
    content: `Mỗi khi mùa mưa bão tới, câu chuyện ngập lụt tại các đô thị lớn như Hà Nội, TP.HCM, Đà Nẵng lại làm nóng nghị trường và gây xáo trộn đời sống của hàng triệu thị dân. Mặc dù hàng chục nghìn tỷ đồng từ nguồn vốn ngân sách và ODA đã được rót vào các dự án cống ngầm, trạm bơm cưỡng bức, đê bao ngăn triều, nhưng tình trạng "hễ mưa là ngập" vẫn chưa có dấu hiệu thuyên giảm.

Thực tế nghiên cứu địa chất và thủy văn chỉ ra 3 "căn bệnh" cốt lõi trong công tác quy hoạch:

1. Tỷ lệ bê tông hóa quá mức triệt tiêu khả năng thấm tự nhiên:
Tại các quận trung tâm, diện tích đất mặt tự nhiên có thể thẩm thấu nước chỉ còn chưa đầy 8%. Hàng trăm hồ điều hòa tự nhiên bị san lấp hoặc thu hẹp diện tích để làm dự án bất động sản khiến nước mưa không còn nơi tích trữ tạm thời trước khi rút ra sông.

2. Cốt nền xây dựng cục bộ tạo hiệu ứng "bình thông nhau" biến tướng:
Nhiều khu đô thị mới được phép tôn cao cốt nền từ 0,5m đến 1m so với xung quanh mà không có giải pháp liên hoàn, biến các khu dân cư hiện hữu lân cận thành lòng chảo chứa nước thải và nước mưa dồn về.

3. Tư duy thoát nước cưỡng bức truyền thống đã lỗi thời:
Hệ thống cống ngầm dù có kích thước lớn đến đâu cũng sẽ bị quá tải trước các trận mưa vượt ngưỡng lịch sử (trên 150mm trong 2 giờ). Giải pháp căn cơ mang tính chiến lược của thế giới hiện nay là kiến tạo "Đô thị bọt biển" (Sponge City):
- Bắt buộc các dự án phát triển đô thị mới phải dành tối thiểu 20% quỹ đất làm không gian thấm nước và hồ điều tiết ngầm.
- Áp dụng vật liệu lát vỉa hè, công viên bằng bê tông rỗng xốp thấm hút nước.
- Xây dựng bản đồ phân vùng rủi ro ngập lụt tích hợp dữ liệu thời gian thực để người dân và cơ quan vận hành hạ tầng chủ động phương án điều tiết.`,
    category: 'Quy hoạch & Môi trường',
    tags: ['Chống ngập đô thị', 'Biến đổi khí hậu', 'Đô thị bọt biển', 'Quy hoạch hạ tầng', 'Góc nhìn chuyên gia'],
    authorName: 'PGS. TS Trần Đình Khiêm',
    authorPenName: 'PGS. TS Trần Đình Khiêm',
    authorTitle: 'Viện trưởng Viện Nghiên cứu Đô thị & Thủy văn Biến đổi Khí hậu',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    authorOrganization: 'Viện Hàn lâm Khoa học & Công nghệ Việt Nam',
    authorPhone: '0903.456.789',
    authorEmail: 'khiem.tran@vast.ac.vn',
    submittedAt: '2026-09-26 10:00',
    status: 'PENDING_REVIEW',
    royaltyTier: 'SPECIAL',
    royaltyAmount: 2500000,
    editorNote: 'Bài viết có hàm lượng khoa học rất cao, luận điểm sắc sảo, có tính phản biện chính sách mạnh mẽ.',
    factCheckScore: 99,
    factCheckNotes: 'Số liệu đo đạc thủy văn và dẫn chứng từ các nghiên cứu quốc tế được trích dẫn chuẩn xác.',
    attachments: [
      {
        id: 'att-exp-101',
        name: 'so_do_mo_hinh_sponge_city.png',
        url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80',
        caption: 'Mô hình mặt cắt hạ tầng thẩm thấu nước tuần hoàn cho đô thị bền vững',
        type: 'image',
      },
    ],
  },
  {
    id: 'art-exp-102',
    code: 'EXP-2026-102',
    sourceType: 'EXPERT',
    title: 'Khung pháp lý bảo vệ nguồn tin báo chí và người dân phản ánh tiêu cực: Cần cơ chế bảo vệ khẩn cấp ngay khi phát lệnh tố giác',
    sapo: 'Dưới góc nhìn pháp lý, Luật sư Lê Trọng Quý phân tích thực trạng người dân e ngại gửi tin tố giác tham nhũng, ô nhiễm vì sợ bị trả thù, từ đó đề xuất thiết lập hành lang pháp lý bảo vệ bí mật tuyệt đối danh tính người báo tin.',
    content: `Điều 38 Luật Báo chí năm 2016 quy định rất rõ: Cơ quan báo chí và nhà báo có quyền và nghĩa vụ không tiết lộ tên người cung cấp thông tin nếu có hại cho người đó, trừ trường hợp có yêu cầu bằng văn bản của Viện trưởng Viện Kiểm sát nhân dân hoặc Chánh án Tòa án nhân dân cấp tỉnh trở lên.

Tuy nhiên, trong thực tiễn tác nghiệp và tiếp nhận tin phản ánh dân sinh, người dân khi phát hiện hành vi vi phạm pháp luật (như khai thác cát lậu, phá rừng, xả thải trộm, tiêu cực trong bộ máy công quyền) vẫn mang tâm lý e ngại, lo sợ bị lộ danh tính dẫn đến bị đe dọa sức khỏe, tính mạng hoặc công việc làm ăn.

Ba lỗ hổng pháp lý cần sớm được hoàn thiện bao gồm:

Thứ nhất, thiếu cơ chế "Bảo vệ tức thì" (Instant Protection):
Hiện nay chưa có quy chế phối hợp khẩn cấp giữa cơ quan báo chí và cơ quan công an sở tại trong việc phong tỏa danh tính và bố trí lực lượng bảo vệ khi người báo tin nhận được tin nhắn đe dọa, khủng bố tinh thần.

Thứ hai, trách nhiệm bảo mật công nghệ thông tin trong tiếp nhận tin báo:
Cần chuẩn hóa quy trình tiếp nhận tin điện tử với công nghệ mã hóa đầu cuối (End-to-End Encryption) và quy trình giải mật nhiều tầng có kiểm soát bằng OTP từ lãnh đạo cao nhất của tòa soạn, tránh tình trạng lộ lọt dữ liệu từ cấp cơ sở.

Thứ ba, chế tài xử lý nghiêm khắc hành vi trù dập người báo tin:
Cần bổ sung các tình tiết định khung tăng nặng trong Bộ luật Hình sự đối với các hành vi truy tìm, đe dọa, xúc phạm danh dự hoặc gây khó dễ đối với những cá nhân, tập thể có tinh thần dũng cảm cung cấp tin tức xác thực cho cơ quan báo chí và pháp luật.`,
    category: 'Pháp luật & Tư pháp',
    tags: ['Bảo vệ nguồn tin', 'Luật Báo chí 2016', 'Bảo mật danh tính', 'Góc nhìn luật sư', 'Công lý dân sinh'],
    authorName: 'Luật sư Lê Trọng Quý',
    authorPenName: 'Luật sư Lê Trọng Quý',
    authorTitle: 'Phó Chủ nhiệm Ủy ban Nhân quyền & Trợ giúp Pháp lý',
    authorAvatar: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?w=200&auto=format&fit=crop&q=80',
    authorOrganization: 'Đoàn Luật sư TP. Hà Nội',
    authorPhone: '0912.333.666',
    authorEmail: 'quy.le@hanoibar.vn',
    submittedAt: '2026-09-25 16:45',
    status: 'APPROVED',
    royaltyTier: 'TIER_A',
    royaltyAmount: 1800000,
    editorNote: 'Đã hoàn tất biên tập và thẩm định duyệt đăng trong chuyên mục Diễn Đàn Pháp Luật.',
    factCheckScore: 97,
    factCheckNotes: 'Các viện dẫn điều luật chuẩn xác theo Luật Báo chí 2016 và BLHS 2015 sửa đổi 2017.',
    attachments: [
      {
        id: 'att-exp-102',
        name: 'anh_luat_su_le_trong_quy.jpg',
        url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&auto=format&fit=crop&q=80',
        caption: 'Luật sư Lê Trọng Quý trong buổi trao đổi về quyền bảo vệ nguồn tin của nhân dân',
        type: 'image',
      },
    ],
  },
  {
    id: 'art-exp-103',
    code: 'EXP-2026-103',
    sourceType: 'EXPERT',
    title: 'Bẫy lừa đảo tài chính công nghệ cao nhắm vào người cao tuổi: Thủ đoạn thao túng tâm lý Deepfake và trách nhiệm của ngân hàng',
    sapo: 'TS. Nguyễn Mai Lan bóc trần những chiêu thức lừa đảo qua không gian mạng tinh vi nhất năm 2026, sử dụng AI Deepfake giả mạo giọng nói con cháu để chiếm đoạt tiền tiết kiệm của hàng nghìn gia đình.',
    content: `Trong 9 tháng đầu năm 2026, thiệt hại từ các vụ lừa đảo qua mạng tại Việt Nam ước tính đã vượt con số 15.000 tỷ đồng, trong đó hơn 60% nạn nhân là người cao tuổi, người về hưu hoặc phụ nữ ở nhà nội trợ.

Thủ đoạn ngày nay đã phát triển sang giai đoạn "Thao túng nhận thức bằng công nghệ AI sinh tác nhân" (Generative AI Weaponization):
Kẻ gian quét dữ liệu cá nhân rò rỉ từ các ứng dụng mua sắm, khai thác giọng nói và hình ảnh từ các video đăng tải trên mạng xã hội để tạo ra các cuộc gọi video Deepfake với độ trễ thấp đáng kinh ngạc. Khi người già nhìn thấy hình ảnh con cái đang khóc lóc vì gặp tai nạn ở nước ngoài hoặc cần tiền gấp để giải quyết sự cố, phản xạ tâm lý tự nhiên là lập tức chuyển tiền mà không kịp kiểm chứng.

Chuyên gia chỉ ra 2 giải pháp kỹ thuật bắt buộc:
1. Áp dụng cơ chế "Trì hoãn giải ngân thông minh" (Smart Cooling-off Period): Đối với các tài khoản mở mới dưới 3 tháng hoặc tài khoản có biểu hiện chuyển tiền bất thường ngoài khung giờ quen thuộc, ngân hàng phải áp dụng thời gian tạm giữ 2 giờ trước khi ghi có cho tài khoản đích.
2. Trách nhiệm liên đới của các tổ chức tín dụng: Khi để lọt các tài khoản rác "thuê mượn CMND/CCCD" phục vụ rửa tiền lừa đảo, ngân hàng thụ hưởng phải chịu chế tài phạt nặng và bồi thường một phần thiệt hại cho nạn nhân.`,
    category: 'An ninh mạng & Kinh tế số',
    tags: ['Lừa đảo công nghệ cao', 'AI Deepfake', 'Bảo vệ người cao tuổi', 'An toàn ngân hàng'],
    authorName: 'TS. Nguyễn Mai Lan',
    authorPenName: 'TS. Nguyễn Mai Lan',
    authorTitle: 'Giảng viên cao cấp Viện Đào tạo An ninh mạng & Kinh tế số',
    authorAvatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&auto=format&fit=crop&q=80',
    authorOrganization: 'Đại học Quốc gia Hà Nội',
    authorPhone: '0988.776.655',
    authorEmail: 'mailan.nguyen@vnu.edu.vn',
    submittedAt: '2026-09-24 11:15',
    status: 'APPROVED',
    royaltyTier: 'TIER_A',
    royaltyAmount: 2000000,
    editorNote: 'Đã hoàn tất duyệt chuyên môn, bài viết rất thiết thực với bạn đọc.',
    factCheckScore: 98,
    factCheckNotes: 'Đầy đủ dẫn chứng kỹ thuật và phân tích rủi ro an ninh số.',
    attachments: [
      {
        id: 'att-exp-103',
        name: 'canh_bao_lua_dao_deepfake.jpg',
        url: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=80',
        caption: 'Cảnh giác trước các cuộc gọi video mờ nhạt có dấu hiệu chắp vá hình ảnh của kẻ lừa đảo',
        type: 'image',
      },
    ],
  },

  // ==================== 3. NHÀ BÁO (JOURNALIST) ====================
  {
    id: 'art-jrn-201',
    code: 'JRN-2026-201',
    sourceType: 'JOURNALIST',
    title: 'Điều tra độc quyền: Vạch trần đường dây buôn bán thực phẩm chức năng giả gắn mác "thần dược chữa ung thư" tại các vùng quê nghèo',
    sapo: 'Sau 3 tháng thâm nhập thực tế vào các "hội thảo tri ân người già" trá hình, nhóm phóng viên điều tra Báo Tin Nóng Dân Sinh đã bóc trần công nghệ tán bột củ đậu pha hóa chất độc hại bán giá cắt cổ cho bệnh nhân nan y.',
    content: `Trong căn phòng rộng chừng 30 mét vuông ẩm thấp tại một xưởng thủ công nằm khuất sâu trong con ngõ nhỏ ngoại thành, hàng chục bao tải chứa bột củ đậu khô, bột bắp và phẩm màu công nghiệp xếp la liệt dưới đất. Bên cạnh đó là chiếc máy dập viên thủ công liên tục nhả ra những viên nang màu xanh đỏ bắt mắt.

Sau khi được đóng vào những lọ nhựa dán tem nhãn lấp lánh chữ tiếng nước ngoài với dòng chữ "Chiết xuất Nano Đông trùng quý hiếm", mỗi hộp thuốc có giá thành xuất xưởng chưa đầy 12.000 đồng đã được các đối tượng mang về các miền quê hẻo lánh bán với giá 1.800.000 đồng đến 2.500.000 đồng/hộp.

Chiêu trò tinh vi của nhóm đối tượng:
- Thuê hội trường nhà văn hóa thôn dưới danh nghĩa "Tổ chức khám sức khỏe miễn phí và tặng quà tri ân".
- Cho người đóng giả bác sĩ chuyên khoa đầu ngành từ các bệnh viện lớn tại Hà Nội để "bắt bệnh", hù dọa người dân mắc khối u ác tính.
- Dùng "chim mồi" là những người trong đường dây vờ tranh nhau mua hết hàng để kích thích tâm lý đám đông lo sợ hết thuốc.

Nhiều cụ già nghèo đã phải bán cả đàn gà, vay mượn tiền dưỡng già của con cháu để mua hàng chục hộp thuốc rởm với hy vọng khỏi bệnh, để rồi sau đó bệnh tình càng thêm trầm trọng vì bỏ phác đồ điều trị chính thống tại bệnh viện.

Phóng viên đã chuyển giao toàn bộ chứng cứ ghi âm, ghi hình bí mật cùng danh sách kho hàng cho Cục Cảnh sát Điều tra Tội phạm về Tham nhũng, Kinh tế, Buôn lậu (C03) để mở rộng chuyên án triệt phá.`,
    category: 'Điều tra - Pháp luật',
    tags: ['Điều tra độc quyền', 'Thuốc giả', 'Lừa đảo bệnh nhân', 'Pháp luật', 'Báo chí điều tra'],
    authorName: 'Vũ Trọng Nam',
    authorPenName: 'Trọng Nam (Ban Điều tra)',
    authorTitle: 'Phóng viên Điều tra Cao cấp',
    authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80',
    authorOrganization: 'Ban Điều tra - Pháp luật Tòa soạn',
    authorPhone: '0904.112.233',
    authorEmail: 'trongnam.investigation@toasoan.vn',
    submittedAt: '2026-09-27 07:10',
    status: 'PENDING_REVIEW',
    royaltyTier: 'SPECIAL',
    royaltyAmount: 3500000,
    editorNote: 'Tuyến bài điều tra công phu xuất sắc, chứng cứ không thể chối cãi. Đề xuất ưu tiên duyệt đăng trang nhất.',
    factCheckScore: 100,
    factCheckNotes: 'Toàn bộ băng ghi âm bí mật và mẫu giám định thành phần đã được viện kiểm nghiệm xác nhận.',
    attachments: [
      {
        id: 'att-jrn-201',
        name: 'kho_xuong_thuoc_gia.jpg',
        url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=80',
        caption: 'Bên trong xưởng sản xuất bột hóa chất đóng viên nang giả mạo thảo dược quý',
        type: 'image',
      },
    ],
  },
  {
    id: 'art-jrn-202',
    code: 'JRN-2026-202',
    sourceType: 'JOURNALIST',
    title: 'Bất cập quản lý "chung cư mini" biến tướng: Khi chuồng cọp bít bùng lối thoát và bài toán an toàn tính mạng cư dân',
    sapo: 'Dù nhiều quy định siết chặt đã được ban hành sau các vụ hỏa hoạn thương tâm, phóng viên ghi nhận hàng trăm khu nhà trọ cao tầng gắn mác "chung cư mini" vẫn ngang nhiên cơi nới không phép, khóa trái lối thoát nạn thứ hai.',
    content: `Khảo sát thực tế của nhóm phóng viên tại các quận tập trung đông trường đại học và khu văn phòng như Cầu Giấy, Đống Đa, Thanh Xuân cho thấy:

Trên những con ngõ nhỏ chỉ rộng chừng 1,8m đến 2m – nơi xe chữa cháy hoàn toàn không thể tiếp cận – hàng loạt căn nhà cao từ 7 đến 9 tầng với mật độ 30 đến 50 phòng trọ khép kín vẫn mọc lên san sát. Để tối ưu hóa diện tích cho thuê, hầu hết chủ nhà đều hàn kín khung sắt "chuồng cọp" kiên cố bao quanh toàn bộ ban công và cửa sổ.

Đáng báo động, tầng 1 của hầu hết các tòa nhà này là nơi tập kết từ 40 đến 70 chiếc xe máy xăng và xe điện, cắm sạc qua đêm chung vào một ổ điện chắp vá không có rơ-le tự ngắt. Lối thoát nạn khẩn cấp duy nhất là chiếc cầu thang bộ xoắn ốc rộng chưa đầy 90cm thường xuyên bị các thùng xốp, giá giày dép của người thuê chiếm dụng.

Người dân sống trong các khu nhà này thừa nhận họ nơm nớp lo sợ mỗi đêm, nhưng vì mức giá thuê hợp lý và vị trí gần trung tâm, họ không còn lựa chọn nào khác. Trách nhiệm kiểm tra, giám sát của lực lượng quản lý trật tự xây dựng và công an khu vực đang bị đặt dấu hỏi lớn khi các sai phạm này vẫn tồn tại công khai nhiều năm qua.`,
    category: 'Thời sự - Đời sống',
    tags: ['Chung cư mini', 'Phòng cháy chữa cháy', 'An toàn tính mạng', 'Trật tự xây dựng'],
    authorName: 'Nguyễn Thu Trang',
    authorPenName: 'Thu Trang (Ban Thời sự)',
    authorTitle: 'Phó Trưởng Ban Thời sự & Dân sinh',
    authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    authorOrganization: 'Ban Thời sự Tòa soạn',
    authorPhone: '0903.228.911',
    authorEmail: 'thutrang.editor@toasoan.vn',
    submittedAt: '2026-09-26 15:20',
    status: 'EDITING',
    royaltyTier: 'TIER_A',
    royaltyAmount: 1800000,
    editorNote: 'Đang rà soát lại số liệu tổng hợp các vụ kiểm tra PCCC tại địa bàn quận Cầu Giấy.',
    factCheckScore: 95,
    factCheckNotes: 'Hình ảnh chụp thực tế tại các ngõ 165 Cầu Giấy và ngõ 68 Triều Khúc.',
    attachments: [
      {
        id: 'att-jrn-202',
        name: 'chuong_cop_bit_bung.jpg',
        url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80',
        caption: 'Khung sắt chuồng cọp hàn kín mít từ tầng 2 lên tầng 8 không có cửa mở thoát hiểm',
        type: 'image',
      },
    ],
  },
  {
    id: 'art-jrn-203',
    code: 'JRN-2026-203',
    sourceType: 'JOURNALIST',
    title: 'Chiêu trò "thổi giá" tại các phiên đấu giá đất vùng ven: Dấu hiệu bắt tay dìm giá rồi bỏ cọc trục lợi bất chính',
    sapo: 'Phóng viên kinh tế vạch trần chiêu thức nhóm đầu cơ cấu kết đẩy giá đất ngoại thành lên gấp 4 - 5 lần giá khởi điểm nhằm tạo sóng sốt ảo để xả hàng tồn tại các dự án xung quanh, sau đó sẵn sàng bỏ cọc hàng trăm triệu đồng.',
    content: `Các phiên đấu giá quyền sử dụng đất tại các huyện vùng ven gần đây liên tục ghi nhận mức giá trúng cao kỷ lục, có lô đất ở nông thôn lên tới hơn 130 triệu đồng/m2, ngang ngửa với giá đất tại các khu đô thị lớn hoàn chỉnh hạ tầng.

Tuy nhiên, đằng sau sự sôi động bất thường đó là những toan tính tinh vi của các đội nhóm đầu cơ chuyên nghiệp:
1. Chiêu bài "bão giá" tạo mặt bằng ảo:
Nhóm đối tượng chuẩn bị sẵn hàng chục bộ hồ sơ nhờ người thân đứng tên tham gia đấu giá. Đến các vòng quyết định, họ liên tục trả giá vọt lên mức không tưởng để triệt tiêu toàn bộ người có nhu cầu ở thực sự.

2. Trục lợi từ việc bán chênh lệch đất nền tồn đọng:
Ngay sau khi kết quả đấu giá được công bố rầm rộ trên mạng xã hội, nhóm này lập tức tung quân chào bán hàng chục lô đất mà họ đã gom trước đó tại các khu vực lân cận với giá "thấp hơn giá đấu giá 30%", thu về hàng chục tỷ đồng tiền chênh lệch.

3. "Bài chuồn" bỏ cọc có tính toán:
Khi đã đẩy xong lượng hàng ôm trước đó, nhóm này sẵn sàng chấp nhận mất tiền cọc ban đầu (vốn chỉ chiếm từ 5% đến 10% giá trị hợp đồng). Hậu quả để lại là mặt bằng giá đất bị méo mó, ngân sách nhà nước không thu được tiền và thị trường rơi vào trạng thái đóng băng cục bộ.

Cơ quan quản lý cần khẩn trương bổ sung quy định nâng mức tiền đặt trước lên 30-50% và có chế tài cấm tham gia đấu giá từ 3 đến 5 năm đối với những cá nhân, tổ chức cố tình bỏ cọc nhằm thao túng thị trường.`,
    category: 'Kinh tế - Bất động sản',
    tags: ['Đấu giá đất', 'Sốt đất ảo', 'Thổi giá bỏ cọc', 'Bất động sản', 'Phân tích kinh tế'],
    authorName: 'Đặng Quốc Huy',
    authorPenName: 'Quốc Huy (Ban Kinh tế)',
    authorTitle: 'Trưởng Ban Kinh tế - Bất động sản',
    authorAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80',
    authorOrganization: 'Ban Kinh tế Tòa soạn',
    authorPhone: '0915.223.344',
    authorEmail: 'quochuy.econ@toasoan.vn',
    submittedAt: '2026-09-25 18:00',
    status: 'TRANSFERRED_TO_DEPUTY',
    royaltyTier: 'TIER_A',
    royaltyAmount: 2200000,
    editorNote: 'Đã hoàn tất biên tập số liệu bảng biểu so sánh giá đất, kính trình Phó TBT phê duyệt xuất bản.',
    factCheckScore: 97,
    factCheckNotes: 'Đầy đủ biên bản kết quả đấu giá và danh sách các lô đất bỏ cọc của UBND huyện.',
    attachments: [
      {
        id: 'att-jrn-203',
        name: 'phien_dau_gia_dat_dong_nguoi.jpg',
        url: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&auto=format&fit=crop&q=80',
        caption: 'Hàng trăm nhà đầu tư vây kín hội trường đấu giá đất vùng ven với nhiều diễn biến bất thường',
        type: 'image',
      },
    ],
  },
];
