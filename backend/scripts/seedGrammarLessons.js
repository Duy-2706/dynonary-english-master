
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const { db, COLLECTIONS } = require('../src/configs/firebase.config');

const TEACHER_ID = 'seed_teacher';
const TEACHER_NAME = 'Giáo viên mẫu';

// Helper to build a simple lesson
function L(gradeLevel, topic, title, description, content, exercises, videoUrl) {
  return { gradeLevel, topic, title, description, content, exercises: exercises || [], videoUrl: videoUrl || '' };
}

function mcq(question, options, answer, explanation) {
  return { type: 'mcq', question, options, answer, explanation };
}
function fill(question, answer, explanation) {
  return { type: 'fill_blank', question, answer, explanation };
}

const LESSONS = [

  // ── Khối 1 (16 units) ────────────────────────────────────────────────────────
  L('1','Đại từ nhân xưng & Lời chào','Unit 1: In the school playground',
    'Nhận biết đại từ nhân xưng ngôi I và lời chào cơ bản.',
    `<h3>Đại từ nhân xưng – Personal Pronouns</h3>
<p><b>I</b> = Tôi &nbsp;|&nbsp; <b>You</b> = Bạn</p>
<p><b>Hello! I am Lan.</b> – Xin chào! Tôi là Lan.</p>
<p><b>Hi! I am Nam.</b> – Chào! Tôi là Nam.</p>`,
    [mcq('Đại từ nào dùng để nói về bản thân mình?',['You','He','I','She'],'I','"I" = Tôi – đại từ ngôi thứ nhất số ít.'),
     fill('"___ am Lan." (Tôi là Lan)','I','"I am..." = Tôi là...')]),

  L('1','Mạo từ số ít','Unit 2: In the dining room',
    'Phân biệt sơ khai mạo từ A và An trước danh từ số ít.',
    `<h3>Mạo từ A / AN</h3>
<p><b>A</b> dùng trước phụ âm: a cup, a plate, a fork</p>
<p><b>AN</b> dùng trước nguyên âm (a,e,i,o,u): an apple, an egg</p>`,
    [mcq('Điền đúng: "___ apple"',['a','an','the','Ø'],'an','"apple" bắt đầu bằng nguyên âm → an.'),
     fill('"___ cup of tea"','a','"cup" bắt đầu bằng phụ âm → a.')]),

  L('1','Cấu trúc sở hữu & Câu mệnh lệnh','Unit 3: At the street market',
    'Dùng your để chỉ sở hữu và câu mệnh lệnh đơn giản.',
    `<h3>Your – của bạn</h3>
<p><b>This is your bag.</b> – Đây là túi của bạn.</p>
<h3>Câu mệnh lệnh</h3>
<p><b>Look!</b> – Nhìn kìa! &nbsp; <b>Come here!</b> – Lại đây!</p>`,
    [mcq('"___ book is on the desk." (của bạn)',['My','His','Your','Her'],'Your','"Your" = của bạn.'),
     fill('"___ here, please." (Lại đây)','Come','Come here = Lại đây.')]),

  L('1','Đại từ chỉ định & Tính từ sở hữu','Unit 4: In the bedroom',
    'Dùng this is my... để giới thiệu đồ vật.',
    `<h3>This is my...</h3>
<p><b>This</b> = Đây (vật gần) &nbsp;|&nbsp; <b>my</b> = của tôi</p>
<p><b>This is my bed.</b> – Đây là giường của tôi.</p>
<p><b>This is my toy.</b> – Đây là đồ chơi của tôi.</p>`,
    [mcq('"___ is my room." (Đây)',['That','This','It','These'],'This','"This" = Đây (chỉ vật gần).'),
     fill('"This is ___ pencil." (của tôi)','my','"my" = của tôi.')]),

  L('1','Động từ chỉ sở thích','Unit 5: At the fish and chip shop',
    'Dùng S + like + N để diễn tả sở thích đơn giản.',
    `<h3>Like + Danh từ</h3>
<p><b>I like fish.</b> – Tôi thích cá.</p>
<p><b>I like chips.</b> – Tôi thích khoai tây chiên.</p>
<p><b>Do you like...?</b> – Bạn có thích... không?</p>`,
    [mcq('"I ___ ice cream." (thích)',['likes','liking','like','liked'],'like','"I like..." – ngôi 1 dùng like (không thêm s).'),
     fill('"___ you like pizza?" (Bạn có thích...)','Do','Câu hỏi với I/You: Do + S + like?')]),

  L('1','Câu mệnh lệnh lớp học','Unit 6: In the classroom',
    'Câu mệnh lệnh khẳng định và phủ định trong lớp học.',
    `<h3>Mệnh lệnh lớp học</h3>
<p><b>Sit down.</b> – Ngồi xuống. &nbsp; <b>Stand up.</b> – Đứng lên.</p>
<p><b>Open your book.</b> – Mở sách ra. &nbsp; <b>Close your book.</b> – Đóng sách lại.</p>
<p><b>Don't talk.</b> – Đừng nói chuyện.</p>`,
    [mcq('Câu mệnh lệnh nào có nghĩa "Ngồi xuống"?',['Stand up','Sit down','Come in','Go out'],'Sit down','"Sit down" = Ngồi xuống.'),
     fill('"___ your book, please." (Mở ra)','Open','"Open your book" = Mở sách ra.')]),

  L('1','Động từ Have ngôi thứ nhất','Unit 7: In the kitchen',
    'Dùng I have để diễn tả sở hữu cá nhân.',
    `<h3>I have... – Tôi có...</h3>
<p><b>I have a spoon.</b> – Tôi có một cái muỗng.</p>
<p><b>I have a bowl.</b> – Tôi có một cái bát.</p>
<p>Cấu trúc: <b>I + have + a/an + N</b></p>`,
    [mcq('"I ___ a cup." (có)',['has','is','have','am'],'have','"I have" = Tôi có. Ngôi 1 dùng have.'),
     fill('"I have ___ egg." (một quả trứng)','an','"egg" bắt đầu bằng nguyên âm → an.')]),

  L('1','Câu mệnh lệnh hướng chú ý','Unit 8: In the park',
    'Dùng Look at... để hướng sự chú ý.',
    `<h3>Look at... – Nhìn vào...</h3>
<p><b>Look at the bird!</b> – Nhìn con chim kìa!</p>
<p><b>Look at me!</b> – Nhìn tôi kìa!</p>
<p><b>Look at this tree.</b> – Nhìn cái cây này.</p>`,
    [fill('"___ at the dog!" (Nhìn kìa)','Look','"Look at..." = Nhìn vào...'),
     mcq('Câu nào đúng?',['Look to the cat.','Look at the cat.','See at the cat.','Watch to the cat.'],'Look at the cat.','"Look at" là cấu trúc đúng để hướng chú ý.')]),

  L('1','Động từ Can – thị giác','Unit 9: In the shop',
    'Dùng can see để mô tả những gì nhìn thấy.',
    `<h3>I can see... – Tôi có thể nhìn thấy...</h3>
<p><b>I can see a ball.</b> – Tôi thấy một quả bóng.</p>
<p><b>Can you see it?</b> – Bạn có thấy nó không?</p>
<p><b>Yes, I can.</b> / <b>No, I can't.</b></p>`,
    [mcq('"I ___ see a kite." (có thể)',['must','can','am','do'],'can','"can" = có thể.'),
     fill('"Can you see ___?" – "Yes, I ___." (can)','can','"Can you...? → Yes, I can."')]),

  L('1','Câu hỏi đảo To-be','Unit 10: At the zoo',
    'Hỏi và đáp về vật thể với Is it...?',
    `<h3>Is it...? – Đó có phải là... không?</h3>
<p><b>Is it a lion?</b> – Đó có phải là sư tử không?</p>
<p><b>Yes, it is.</b> – Vâng, đúng vậy.</p>
<p><b>No, it isn't.</b> – Không, không phải.</p>`,
    [fill('"___ it a tiger?" (Đó có phải...)','Is','"Is it...?" = câu hỏi với đại từ it.'),
     mcq('Trả lời phủ định "Is it a cat?"',['Yes, it is.','No, it isn\'t.','No, it not.','No, it aren\'t.'],"No, it isn't.",'Phủ định: No, it isn\'t. (= is not)')]),

  L('1','Hiện tại tiếp diễn – nhận diện','Unit 11: At the back garden',
    'Nhận diện cụm V-ing trong câu hiện tại tiếp diễn.',
    `<h3>Cụm V-ing – đang làm gì</h3>
<p><b>running</b> – đang chạy &nbsp; <b>jumping</b> – đang nhảy</p>
<p><b>playing</b> – đang chơi &nbsp; <b>singing</b> – đang hát</p>
<p>Mẫu câu: <b>I am + V-ing</b></p>
<p>I am <b>playing</b> in the garden.</p>`,
    [mcq('Dạng V-ing của "run" là gì?',['runing','runs','running','ran'],'running','run → running (nhân đôi phụ âm cuối).'),
     fill('"I am ___ (play) football."','playing','"I am playing" = Tôi đang chơi.')]),

  L('1','Câu mệnh lệnh chỉ định trực quan','Unit 12: On the lake',
    'Ôn tập câu mệnh lệnh và chỉ định trực quan.',
    `<h3>Câu chỉ định & mệnh lệnh</h3>
<p><b>Look!</b> – Nhìn kìa! &nbsp; <b>See!</b> – Xem kìa!</p>
<p><b>Point to the boat.</b> – Chỉ vào thuyền.</p>
<p><b>Touch the water.</b> – Chạm vào nước.</p>`,
    [mcq('Câu nào là câu mệnh lệnh?',['I like boats.','Is it a boat?','Look at the boat!','The boat is big.'],'Look at the boat!','Câu mệnh lệnh không có chủ ngữ, bắt đầu bằng động từ.'),
     fill('"___ to the fish." (Chỉ vào)','Point','"Point to..." = Chỉ vào...')]),

  L('1','Mẫu câu đề nghị lịch sự','Unit 13: In the school canteen',
    'Dùng Would like để đề nghị lịch sự.',
    `<h3>Would like + N – Muốn...</h3>
<p><b>I would like some rice.</b> – Tôi muốn một ít cơm.</p>
<p><b>Would you like some milk?</b> – Bạn có muốn sữa không?</p>
<p><b>Yes, please.</b> / <b>No, thank you.</b></p>`,
    [fill('"I ___ like some juice." (muốn)','would','"would like" = muốn (lịch sự hơn want).'),
     mcq('Trả lời lịch sự khi đồng ý "Would you like some soup?"',['Yes, I like.','Yes, please.','Yes, I would like.','Yes, I do.'],'Yes, please.','Trả lời lịch sự nhất: "Yes, please."')]),

  L('1','Danh từ số nhiều','Unit 14: In the toy shop',
    'Quy tắc thêm -s để tạo danh từ số nhiều.',
    `<h3>Số nhiều của danh từ – Plural Nouns</h3>
<p>Thêm <b>-s</b>: toy → toys, doll → dolls, car → cars</p>
<p>Thêm <b>-es</b>: box → boxes, bus → buses</p>
<p><b>I have two toys.</b> – Tôi có hai đồ chơi.</p>`,
    [mcq('Số nhiều của "toy" là gì?',['toies','toys','toyes','toy'],'toys','toy → toys (thêm s thông thường).'),
     fill('Số nhiều của "box": box → ___','boxes','box kết thúc bằng x → thêm -es.')]),

  L('1','Mẫu câu đề nghị / Rủ rê','Unit 15: At the weekend',
    "Dùng Let's + V để đề nghị hoặc rủ rê.",
    `<h3>Let's + V – Chúng ta hãy...</h3>
<p><b>Let's play!</b> – Chúng ta hãy chơi!</p>
<p><b>Let's go to the park.</b> – Chúng ta hãy đến công viên.</p>
<p><b>Let's sing a song.</b> – Chúng ta hãy hát một bài.</p>`,
    [fill('"___ play football!" (Chúng ta hãy)','Let\'s','"Let\'s" = Let us (rút gọn) = Chúng ta hãy.'),
     mcq('"Let\'s ___!" (chơi)',['plays','playing','to play','play'],'play','Sau "Let\'s" dùng động từ nguyên mẫu không "to".')]),

  L('1','Cấu trúc chào tạm biệt','Unit 16: At home',
    'Các cách chào tạm biệt và cấu trúc See you.',
    `<h3>Lời chào tạm biệt</h3>
<p><b>Goodbye!</b> – Tạm biệt!</p>
<p><b>Bye!</b> – Tạm biệt! (thân mật)</p>
<p><b>See you tomorrow.</b> – Hẹn gặp lại ngày mai.</p>
<p><b>See you later.</b> – Hẹn gặp lại sau.</p>`,
    [mcq('Câu nào là lời chào tạm biệt?',['Hello!','Good morning!','Goodbye!','How are you?'],'Goodbye!','"Goodbye" là lời chào khi chia tay.'),
     fill('"See you ___." (Hẹn gặp lại ngày mai)','tomorrow','"See you tomorrow" = Hẹn gặp ngày mai.')]),

  // ── Khối 2 (16 units) ────────────────────────────────────────────────────────
  L('2','Động từ Have – sở hữu','Unit 1: At my birthday party',
    'Dùng have để diễn tả sở hữu cá nhân khẳng định.',
    `<h3>I have... – Tôi có...</h3>
<p><b>I have a cake.</b> – Tôi có một cái bánh.</p>
<p><b>I have many presents.</b> – Tôi có nhiều quà.</p>
<p><b>Do you have a balloon?</b> – Bạn có bóng bay không?</p>`,
    [mcq('"I ___ a birthday cake." (có)',['has','is','have','am'],'have','Ngôi I dùng "have".'),
     fill('"___ you have a present?" (Bạn có...)','Do','Câu hỏi với I/You: Do + S + have?')]),

  L('2','Đại từ chỉ định số nhiều','Unit 2: In the backyard',
    'Dùng These are... để giới thiệu nhiều vật cùng lúc.',
    `<h3>These are... – Đây là (số nhiều)...</h3>
<p><b>This is</b> a flower. (số ít) → <b>These are</b> flowers. (số nhiều)</p>
<p><b>These are butterflies.</b> – Đây là những con bướm.</p>
<p><b>What are these?</b> – Đây là những gì?</p>`,
    [fill('"___ are my friends." (Đây là – số nhiều)','These','"These are" = số nhiều của "This is".'),
     mcq('Câu hỏi số nhiều của "What is this?"',['What is these?','What are these?','What are this?','What is those?'],'What are these?','Số nhiều: What are these?')]),

  L('2','Chia động từ theo chủ ngữ số ít','Unit 3: At the seaside',
    'Hỏi vị trí và hành động, chia động từ theo chủ ngữ số ít ngôi 3.',
    `<h3>He/She + động từ thêm -s</h3>
<p><b>He swims</b> in the sea. – Anh ấy bơi trong biển.</p>
<p><b>She runs</b> on the beach. – Cô ấy chạy trên bãi biển.</p>
<p><b>Where is he?</b> – Anh ấy ở đâu?</p>`,
    [mcq('"She ___ on the beach." (chạy)',['run','running','runs','is run'],'runs','She (ngôi 3 số ít) → runs (thêm s).'),
     fill('"He ___ (swim) every day."','swims','swim + s = swims (ngôi 3 số ít).')]),

  L('2','There is + N số ít','Unit 4: In the countryside',
    'Dùng There is để mô tả sự tồn tại của một vật.',
    `<h3>There is... – Có một...</h3>
<p><b>There is a river.</b> – Có một con sông.</p>
<p><b>There is a big tree.</b> – Có một cái cây to.</p>
<p><b>Is there a farm?</b> – Có trang trại không?</p>`,
    [fill('"There ___ a house here." (có)','is','"There is" = Có một... (số ít).'),
     mcq('Câu hỏi "Is there a cow?" trả lời đúng:',['Yes, there are.','No, there isn\'t.','No, there aren\'t.','Yes, it is.'],"No, there isn't.",'Phủ định: No, there isn\'t (= is not).')]),

  L('2','How many – hỏi số lượng','Unit 5: In the classroom',
    'Cách hỏi số lượng với How many + N số nhiều.',
    `<h3>How many...? – Có bao nhiêu...?</h3>
<p><b>How many books are there?</b> – Có bao nhiêu quyển sách?</p>
<p><b>There are five books.</b> – Có năm quyển sách.</p>
<p><b>How many students are in your class?</b> – Lớp bạn có bao nhiêu học sinh?</p>`,
    [fill('"___ many pencils are there?"','How','"How many" = bao nhiêu (đếm được).'),
     mcq('"How many chairs are there?" → "___ six chairs."',['There is','There have','There are','There be'],'There are','Số nhiều → There are.')]),

  L('2','Can – diễn đạt khả năng','Unit 6: On the farm',
    'Dùng Can để diễn đạt khả năng nhìn thấy và làm việc.',
    `<h3>Can – Có thể</h3>
<p><b>I can see a cow.</b> – Tôi thấy một con bò.</p>
<p><b>Can you see the horse?</b> – Bạn có thể nhìn thấy con ngựa không?</p>
<p><b>Yes, I can.</b> / <b>No, I can't.</b></p>`,
    [mcq('"She ___ ride a horse." (có thể)',['is','does','can','has'],'can','"can" = có thể.'),
     fill('"Can you see the duck?" – "Yes, I ___."','can','Trả lời khẳng định: Yes, I can.')]),

  L('2','Câu hỏi Wh- với Do','Unit 7: In the kitchen',
    'Câu hỏi Wh-question với trợ động từ Do để hỏi về mong muốn.',
    `<h3>What do you want? – Bạn muốn gì?</h3>
<p><b>What do you want for breakfast?</b> – Bạn muốn ăn sáng gì?</p>
<p><b>I want some bread.</b> – Tôi muốn bánh mì.</p>
<p><b>What do you like?</b> – Bạn thích gì?</p>`,
    [fill('"What ___ you want?" (Bạn muốn gì)','do','"What do you want?" = câu hỏi Wh- với do.'),
     mcq('"What do you want?" → "___ some milk."',['I wanting','I wants','I want','I am want'],'I want','"I want" = Tôi muốn.')]),

  L('2','Is there a...? – hỏi số lượng','Unit 8: In the village',
    'Câu hỏi đảo số lượng với Is there a...?',
    `<h3>Is there a...? – Có... không?</h3>
<p><b>Is there a market?</b> – Có chợ không?</p>
<p><b>Yes, there is.</b> – Có, có một cái.</p>
<p><b>No, there isn't.</b> – Không, không có.</p>`,
    [mcq('"___ there a school in the village?"',['Are','Is','Do','Does'],'Is','"Is there a...?" – câu hỏi với danh từ số ít.'),
     fill('"Is there a hospital?" – "Yes, there ___."','is','Trả lời: Yes, there is.')]),

  L('2','Cấu trúc sở thích ngôi thứ nhất','Unit 9: In the grocery store',
    'Ôn tập cấu trúc sở thích với chủ ngữ ngôi thứ nhất.',
    `<h3>I like / I don't like</h3>
<p><b>I like vegetables.</b> – Tôi thích rau củ.</p>
<p><b>I don't like onions.</b> – Tôi không thích hành tây.</p>
<p><b>Do you like carrots?</b> – Bạn có thích cà rốt không?</p>`,
    [fill('"I ___ like spinach." (không thích)','don\'t','"don\'t like" = không thích (ngôi 1).'),
     mcq('Câu hỏi: "___ you like tomatoes?"',['Does','Do','Is','Are'],'Do','Chủ ngữ you → Do you like...?')]),

  L('2','Can – hỏi năng lực','Unit 10: At the campsite',
    'Dùng Can để hỏi về năng lực hành động.',
    `<h3>Can you...? – Bạn có thể... không?</h3>
<p><b>Can you swim?</b> – Bạn có thể bơi không?</p>
<p><b>Can you climb a tree?</b> – Bạn có thể leo cây không?</p>
<p><b>Yes, I can.</b> / <b>No, I can't.</b></p>`,
    [mcq('"Can she ___ a tent?"',['sets','setting','set','to set'],'set','Sau "can" dùng động từ nguyên mẫu không "to".'),
     fill('"Can you run fast?" – "Yes, I ___."','can','Trả lời: Yes, I can.')]),

  L('2','Thì Hiện tại tiếp diễn','Unit 11: In the playground',
    'Hỏi và đáp về hành động đang diễn ra.',
    `<h3>What are you doing? – Bạn đang làm gì?</h3>
<p><b>I am playing.</b> – Tôi đang chơi.</p>
<p><b>She is swinging.</b> – Cô ấy đang đu xích đu.</p>
<p><b>They are running.</b> – Họ đang chạy.</p>`,
    [fill('"I am ___ (jump) now."','jumping','"I am jumping" = Tôi đang nhảy.'),
     mcq('"What ___ she doing?"',['do','does','is','are'],'is','She (số ít) → is.')]),

  L('2','Câu mệnh lệnh hướng ống kính','Unit 12: At the lakeside',
    'Dùng Look and... để hướng dẫn quan sát.',
    `<h3>Look and... – Nhìn và...</h3>
<p><b>Look and point.</b> – Nhìn và chỉ.</p>
<p><b>Look and say.</b> – Nhìn và nói.</p>
<p><b>Listen and repeat.</b> – Nghe và lặp lại.</p>`,
    [mcq('Câu nào là câu mệnh lệnh đúng?',['You look and say.','Looking and saying.','Look and say.','Looked and said.'],'Look and say.','Câu mệnh lệnh bắt đầu bằng động từ nguyên mẫu.'),
     fill('"___ and repeat." (Nghe)','Listen','"Listen and repeat" = Nghe và lặp lại.')]),

  L('2','Would like + Some','Unit 13: In the shopping mall',
    'Kết hợp would like với lượng từ some để diễn tả mong muốn.',
    `<h3>I would like some... – Tôi muốn một ít...</h3>
<p><b>I would like some milk.</b> – Tôi muốn một ít sữa.</p>
<p><b>I would like some bread.</b> – Tôi muốn một ít bánh.</p>
<p><b>some</b> dùng với danh từ không đếm được hoặc số nhiều không xác định.</p>`,
    [fill('"I would like ___ water." (một ít)','some','"some" + danh từ không đếm được.'),
     mcq('"Would you like ___ juice?"',['a','an','some','the'],'some','"some" dùng khi mời/hỏi lịch sự với danh từ không đếm được.')]),

  L('2','Has – sở hữu ngôi số ít','Unit 14: At the campsite',
    'Dùng has cho chủ ngữ ngôi 3 số ít.',
    `<h3>He/She has... – Anh/Cô ấy có...</h3>
<p><b>He has a tent.</b> – Anh ấy có một cái lều.</p>
<p><b>She has a sleeping bag.</b> – Cô ấy có một túi ngủ.</p>
<p>⚠️ I/You/We/They + <b>have</b> &nbsp;|&nbsp; He/She/It + <b>has</b></p>`,
    [mcq('"My dog ___ a long tail."',['have','had','has','is have'],'has','He/She/It → has.'),
     fill('"She ___ a new backpack."','has','She (ngôi 3 số ít) → has.')]),

  L('2','Hiện tại tiếp diễn – trang phục','Unit 15: In the clothes shop',
    'Dùng thì hiện tại tiếp diễn để mô tả trang phục đang mặc.',
    `<h3>What are you wearing? – Bạn đang mặc gì?</h3>
<p><b>I am wearing a red dress.</b> – Tôi đang mặc váy đỏ.</p>
<p><b>She is wearing a blue shirt.</b> – Cô ấy đang mặc áo sơ mi xanh.</p>
<p><b>He is wearing brown shoes.</b> – Anh ấy đang đi giày nâu.</p>`,
    [fill('"She is ___ (wear) a pink skirt."','wearing','"wearing" = V-ing của wear.'),
     mcq('"What are you ___?"',['wear','wore','wearing','wears'],'wearing','Hiện tại tiếp diễn: am/is/are + V-ing.')]),

  L('2','Hiện tại tiếp diễn – chủ ngữ số nhiều','Unit 16: At the water park',
    'Dùng We + are + V-ing để mô tả trạng thái tiếp diễn với chủ ngữ số nhiều.',
    `<h3>We are... – Chúng tôi đang...</h3>
<p><b>We are swimming.</b> – Chúng tôi đang bơi.</p>
<p><b>We are having fun.</b> – Chúng tôi đang vui chơi.</p>
<p><b>They are sliding.</b> – Họ đang trượt.</p>`,
    [fill('"We ___ (splash) in the water."','are splashing','We + are + V-ing.'),
     mcq('"They ___ playing in the pool now."',['is','am','are','be'],'are','They → are.')]),

  // ── Khối 3 (20 units) ────────────────────────────────────────────────────────
  L('3','Lời chào & Động từ To-be','Unit 1: Hello',
    'Đại từ nhân xưng chủ ngữ I/You và Động từ To-be am/are.',
    `<h3>Greetings & To Be</h3>
<p><b>I am</b> Lan. &nbsp; <b>You are</b> Nam.</p>
<p><b>Hello, I am fine.</b> / <b>How are you?</b> – Bạn có khỏe không?</p>
<p><b>I am fine, thank you.</b></p>`,
    [fill('"I ___ Lan." (là)','am','"I am" = Tôi là/Tôi đang.'),
     mcq('"___ are you?" (Bạn có khỏe...)',['How','What','Who','Where'],'How','"How are you?" = Bạn có khỏe không?')]),

  L('3','Tính từ sở hữu my/your','Unit 2: Our names',
    'Tính từ sở hữu my/your và cách hỏi tên.',
    `<h3>My name is... / Your name is...</h3>
<p><b>What is your name?</b> – Tên bạn là gì?</p>
<p><b>My name is Lan.</b> – Tên tôi là Lan.</p>
<p><b>How do you spell it?</b> – Bạn đánh vần như thế nào?</p>`,
    [fill('"What is ___ name?" (của bạn)','your','"your" = của bạn.'),
     mcq('"___ name is Nam." (Tên tôi)',['Your','His','My','Her'],'My','"My" = của tôi.')]),

  L('3','Đại từ chỉ định This/That','Unit 3: Our friends',
    'Đại từ chỉ định This/That và trả lời Yes/No với To-be.',
    `<h3>This / That</h3>
<p><b>This</b> = Đây (gần) &nbsp; <b>That</b> = Kia (xa)</p>
<p><b>This is my friend, Lan.</b> – Đây là bạn tôi, Lan.</p>
<p><b>Is that your teacher?</b> → <b>Yes, it is.</b> / <b>No, it isn't.</b></p>`,
    [mcq('"___ is my book." (vật gần)',['That','Those','This','These'],'This','"This" = Đây, chỉ vật gần.'),
     fill('"Is ___ your friend?" (kia)','that','"That" = Kia, chỉ vật/người xa.')]),

  L('3','Câu mệnh lệnh & Danh từ số ít/nhiều','Unit 4: Our bodies',
    'Câu mệnh lệnh trong lớp và phân biệt danh từ số ít/số nhiều.',
    `<h3>Câu mệnh lệnh</h3>
<p><b>Touch your nose!</b> – Chạm vào mũi! &nbsp; <b>Clap your hands!</b> – Vỗ tay!</p>
<h3>Số ít / Số nhiều</h3>
<p>hand → <b>hands</b> &nbsp; foot → <b>feet</b> &nbsp; eye → <b>eyes</b></p>`,
    [fill('"Clap your ___!" (hands – số nhiều)','hands','"hand" → "hands" (thêm s).'),
     mcq('Số nhiều của "foot":',['foots','feets','feet','foot'],'feet','"foot" → "feet" (bất quy tắc).')]),

  L('3','Danh động từ sau Like','Unit 5: My hobbies',
    'Dùng V-ing (danh động từ) làm tân ngữ sau động từ like.',
    `<h3>I like + V-ing</h3>
<p><b>I like reading.</b> – Tôi thích đọc sách.</p>
<p><b>She likes drawing.</b> – Cô ấy thích vẽ.</p>
<p><b>Do you like swimming?</b> – Bạn có thích bơi không?</p>`,
    [fill('"I like ___ (dance)."','dancing','"like" + V-ing: dancing.'),
     mcq('"She likes ___." (vẽ)',['draw','to drawing','drawing','drew'],'drawing','like + V-ing: drawing.')]),

  L('3',"Let's + Động từ nguyên thể","Unit 6: Our school",
    "Dùng Let's + V để rủ rê, đề nghị.",
    `<h3>Let's + V – Chúng ta hãy...</h3>
<p><b>Let's go to school.</b> – Chúng ta hãy đến trường.</p>
<p><b>Let's clean the classroom.</b> – Chúng ta hãy dọn lớp.</p>
<p><b>Let's play a game.</b> – Chúng ta hãy chơi trò chơi.</p>`,
    [fill('"Let\'s ___ (clean) the board."','clean','Sau "Let\'s" dùng V nguyên mẫu.'),
     mcq('"Let\'s ___!" (sing)',['sings','singing','to sing','sing'],'sing','Let\'s + V nguyên mẫu (không "to").')]),

  L('3','May & Can – xin phép','Unit 7: Classroom instructions',
    'Dùng May và Can để xin phép trong lớp học.',
    `<h3>May / Can + I...?</h3>
<p><b>May I come in?</b> – Tôi có thể vào không? (lịch sự)</p>
<p><b>Can I borrow your pen?</b> – Tôi có thể mượn bút không?</p>
<p><b>Yes, you may.</b> / <b>Yes, you can.</b> / <b>No, you can't.</b></p>`,
    [mcq('"___ I go to the toilet?" (lịch sự)',['Do','Am','May','Will'],'May','"May I...?" lịch sự hơn "Can I...?".'),
     fill('"Can I ___ your eraser?" (mượn)','borrow','"borrow" = mượn.')]),

  L('3','Have & Do – câu hỏi Yes/No','Unit 8: My school things',
    'Động từ have và trợ động từ Do trong câu hỏi hiện tại đơn.',
    `<h3>Do you have...?</h3>
<p><b>I have a ruler.</b> – Tôi có thước kẻ.</p>
<p><b>Do you have a pencil case?</b> – Bạn có hộp bút không?</p>
<p><b>Yes, I do.</b> / <b>No, I don't.</b></p>`,
    [fill('"___ you have a schoolbag?" (Bạn có...)','Do','"Do you have...?" = câu hỏi hiện tại đơn.'),
     mcq('"Do you have an eraser?" → "Yes, I ___."',['am','do','have','does'],'do','Trả lời: Yes, I do.')]),

  L('3','These/Those & any','Unit 9: Our school things',
    'Đại từ chỉ định số nhiều These/Those và dùng any trong câu hỏi.',
    `<h3>These / Those</h3>
<p><b>These</b> = Những cái này (gần) &nbsp; <b>Those</b> = Những cái kia (xa)</p>
<p><b>Are there any books?</b> – Có quyển sách nào không?</p>
<p><b>Yes, there are some.</b> / <b>No, there aren't any.</b></p>`,
    [mcq('"___ are my pencils." (những cái này)',['This','That','These','Those'],'These','"These" = những cái này (gần).'),
     fill('"Are there ___ chairs?" (any/some – câu hỏi)','any','"any" dùng trong câu hỏi và phủ định.')]),

  L('3','Thì Hiện tại đơn – hành động thường ngày','Unit 10: Break time games',
    'Thì Hiện tại đơn với động từ thường chỉ hành động lặp đi lặp lại.',
    `<h3>Present Simple – Hành động thường ngày</h3>
<p><b>I play</b> football every day. – Tôi chơi bóng mỗi ngày.</p>
<p><b>We sing</b> songs at break time. – Chúng tôi hát vào giờ giải lao.</p>
<p>Dấu hiệu: <b>every day, always, usually, often</b></p>`,
    [fill('"She ___ (play) with her friends every day."','plays','She (ngôi 3 số ít) → plays.'),
     mcq('Dấu hiệu nào thuộc thì Hiện tại đơn?',['right now','at the moment','every day','yesterday'],'every day','"every day" = hành động lặp lại → Hiện tại đơn.')]),

  L('3','Who/How old & To-be số ít','Unit 11: My family',
    'Từ để hỏi Who, How old và To-be chia theo số ít (is).',
    `<h3>Who is...? / How old is...?</h3>
<p><b>Who is she?</b> – Cô ấy là ai?</p>
<p><b>She is my mother.</b> – Cô ấy là mẹ tôi.</p>
<p><b>How old is he?</b> – Anh ấy bao nhiêu tuổi?</p>
<p><b>He is 35 years old.</b></p>`,
    [fill('"___ is she?" (Cô ấy là ai)','Who','"Who" = ai.'),
     mcq('"How ___ is your brother?" (bao nhiêu tuổi)',['many','much','old','long'],'old','"How old" = bao nhiêu tuổi.')]),

  L('3','Tính từ sở hữu his/her','Unit 12: Jobs',
    'Tính từ sở hữu ngôi thứ ba số ít: his (của anh ấy), her (của cô ấy).',
    `<h3>His / Her</h3>
<p><b>his</b> = của anh ấy &nbsp; <b>her</b> = của cô ấy</p>
<p><b>His job is a doctor.</b> – Nghề của anh ấy là bác sĩ.</p>
<p><b>Her job is a teacher.</b> – Nghề của cô ấy là giáo viên.</p>`,
    [mcq('"___ father is a driver." (của cô ấy)',['My','His','Her','Your'],'Her','"Her" = của cô ấy.'),
     fill('"Nam is a pilot. ___ job is exciting."','His','Nam là nam → His.')]),

  L('3','There is & Where','Unit 13: My house',
    'Cấu trúc There is và từ hỏi vị trí Where.',
    `<h3>There is... / Where is...?</h3>
<p><b>There is a garden.</b> – Có một khu vườn.</p>
<p><b>Where is the kitchen?</b> – Nhà bếp ở đâu?</p>
<p><b>It is next to the living room.</b> – Nó ở cạnh phòng khách.</p>`,
    [fill('"There ___ a big garden." (có)','is','"There is" = có một (số ít).'),
     mcq('"___ is the bathroom?" (ở đâu)',['What','Who','Where','When'],'Where','"Where" = ở đâu.')]),

  L('3','There are & Giới từ vị trí','Unit 14: My bedroom',
    'Cấu trúc There are và giới từ chỉ vị trí in/on/under.',
    `<h3>There are... / Prepositions</h3>
<p><b>There are two beds.</b> – Có hai cái giường.</p>
<p><b>in</b> = trong &nbsp; <b>on</b> = trên &nbsp; <b>under</b> = dưới</p>
<p>The book is <b>on</b> the desk. – Quyển sách ở <b>trên</b> bàn.</p>`,
    [fill('"There ___ three windows." (số nhiều)','are','"There are" + số nhiều.'),
     mcq('"The cat is ___ the chair." (dưới)',['in','on','under','next to'],'under','"under" = ở dưới.')]),

  L('3','Câu hỏi tính chất & It is/They are','Unit 15: My clothes',
    'Câu hỏi về màu sắc/tính chất và sự hòa hợp chủ ngữ-động từ.',
    `<h3>What colour is it? / What are they like?</h3>
<p><b>What colour is it?</b> → <b>It is red.</b></p>
<p><b>What are they like?</b> → <b>They are beautiful.</b></p>
<p><b>It is</b> (số ít) &nbsp;|&nbsp; <b>They are</b> (số nhiều)</p>`,
    [mcq('"___ is your shirt?" (Màu gì)',['What colour','How colour','Which colour','What colors'],'What colour','"What colour is...?" = màu gì?.'),
     fill('"These shoes are nice. ___ are comfortable too."','They','Số nhiều → They.')]),

  L('3','How many + have?','Unit 16: My pets',
    'Cấu trúc hỏi số lượng How many + N số nhiều + do/does + S + have?',
    `<h3>How many... do you have?</h3>
<p><b>How many pets do you have?</b> – Bạn có bao nhiêu thú cưng?</p>
<p><b>I have two cats.</b></p>
<p><b>How many fish does she have?</b> → <b>She has three fish.</b></p>`,
    [fill('"How many dogs ___ you have?"','do','"I/You/We/They" → do.'),
     mcq('"How many cats ___ she have?"',['do','am','does','is'],'does','She (ngôi 3 số ít) → does.')]),

  L('3','Vị trí số ít & số nhiều','Unit 17: Our toys',
    "Trả lời vị trí của vật số ít (It's next to...) và số nhiều.",
    `<h3>Where is it? / Where are they?</h3>
<p><b>Where is the ball?</b> → <b>It's next to the box.</b></p>
<p><b>Where are the toys?</b> → <b>They're on the shelf.</b></p>
<p>next to = cạnh &nbsp; behind = phía sau &nbsp; in front of = phía trước</p>`,
    [fill('"Where is the kite?" → "___ next to the tree."','It\'s','"It\'s" = It is (số ít).'),
     mcq('"Where are your books?" → "___ on the desk."',['It\'s','He\'s','They\'re','She\'s'],"They're",'Số nhiều → They\'re.')]),

  L('3','There is & There are cùng văn cảnh','Unit 18: My rooms and furniture',
    'Tổng hợp cấu trúc There is và There are trong cùng một đoạn.',
    `<h3>There is... and There are...</h3>
<p><b>There is a sofa</b> in the living room.</p>
<p><b>There are two lamps</b> on the table.</p>
<p>Số ít (1 vật) → There <b>is</b> &nbsp;|&nbsp; Số nhiều → There <b>are</b></p>`,
    [mcq('"There ___ a TV in my room."',['are','is','have','am'],'is','Số ít → There is.'),
     fill('"There ___ four chairs at the table."','are','Số nhiều → There are.')]),

  L('3','Hiện tại tiếp diễn khẳng định','Unit 19: Our outdoor activities',
    'Làm quen Thì Hiện tại tiếp diễn: S + am/is/are + V-ing.',
    `<h3>Present Continuous – Khẳng định</h3>
<p>S + <b>am/is/are</b> + V-ing</p>
<p>I <b>am running</b>. &nbsp; She <b>is jumping</b>. &nbsp; They <b>are playing</b>.</p>
<p>Dấu hiệu: <b>now, at the moment, Look!, Listen!</b></p>`,
    [fill('"He is ___ (climb) a tree."','climbing','"climbing" = V-ing của "climb".'),
     mcq('"They ___ (swim) in the river now."',['swim','swims','are swimming','is swimming'],'are swimming','They + are + V-ing.')]),

  L('3','Giới từ vị trí nơi chốn','Unit 20: Where\'s the shop?',
    'Mở rộng giới từ chỉ vị trí nơi chốn: near, opposite.',
    `<h3>Prepositions of Place</h3>
<p><b>near</b> = gần &nbsp; <b>opposite</b> = đối diện &nbsp; <b>between</b> = giữa</p>
<p>The school is <b>near</b> the park.</p>
<p>The shop is <b>opposite</b> the bank.</p>`,
    [mcq('"The post office is ___ the supermarket." (đối diện)',['near','next to','opposite','behind'],'opposite','"opposite" = đối diện.'),
     fill('"The library is ___ the school and the park." (giữa)','between','"between" = ở giữa (hai vật).')]),

  // ── Khối 4 (20 units) ────────────────────────────────────────────────────────
  L('4','Where... from – nguồn gốc','Unit 1: My friends',
    'Hỏi và nói về nguồn gốc, quê hương với Where... from.',
    `<h3>Where are you from?</h3>
<p><b>Where are you from?</b> – Bạn đến từ đâu?</p>
<p><b>I am from Vietnam.</b> – Tôi đến từ Việt Nam.</p>
<p><b>Where is she from?</b> → <b>She is from Japan.</b></p>`,
    [fill('"Where ___ you from?"','are','"are" đi với "you".'),
     mcq('"She is ___ France." (đến từ)',['in','at','from','of'],'from','"from" = đến từ.')]),

  L('4','Hỏi giờ & Giới từ at','Unit 2: Time and daily routines',
    'Cách hỏi và nói giờ, dùng giới từ at trước mốc thời gian.',
    `<h3>What time is it?</h3>
<p><b>What time is it?</b> – Mấy giờ rồi?</p>
<p><b>It is 7 o'clock.</b> – Bảy giờ.</p>
<p><b>I go to school at 7 o'clock.</b> – Tôi đi học lúc 7 giờ.</p>
<p>Giới từ <b>at</b> + giờ cụ thể: at 8 a.m., at noon, at midnight</p>`,
    [fill('"What ___ is it?" (mấy giờ)','time','"What time is it?" = Mấy giờ rồi?'),
     mcq('"I wake up ___ 6 o\'clock."',['in','on','at','by'],'at','Giờ cụ thể → at.')]),

  L('4','Hỏi ngày & Giới từ on','Unit 3: Days of the week',
    'Cách hỏi ngày trong tuần và giới từ on trước các thứ.',
    `<h3>What day is it?</h3>
<p><b>What day is it today?</b> – Hôm nay là thứ mấy?</p>
<p><b>It is Monday.</b> – Hôm nay là thứ Hai.</p>
<p>Giới từ <b>on</b> + ngày: on Monday, on Saturday, on weekends</p>`,
    [fill('"I have English ___ Wednesday."','on','Ngày trong tuần → on.'),
     mcq('"What day ___ today?"',['am','is','are','be'],'is','Chủ ngữ "it" số ít → is.')]),

  L('4','When & Giới từ in (tháng)','Unit 4: My birthday',
    'Hỏi mốc thời gian định kỳ với When và giới từ in trước tháng.',
    `<h3>When is your birthday?</h3>
<p><b>When is your birthday?</b> – Sinh nhật bạn vào khi nào?</p>
<p><b>It is in September.</b> – Vào tháng Chín.</p>
<p>Giới từ <b>in</b> + tháng/năm: in January, in 2015, in summer</p>`,
    [fill('"My birthday is ___ June."','in','Tháng → in.'),
     mcq('"___ is your birthday?" (Khi nào)',['Where','What','When','Who'],'When','"When" = khi nào.')]),

  L('4','Can – năng lực & động từ nguyên mẫu','Unit 5: Things we can do',
    'Can diễn tả năng lực, luôn theo sau là động từ nguyên mẫu không chia.',
    `<h3>Can + V (nguyên mẫu)</h3>
<p><b>I can play the piano.</b> – Tôi có thể chơi piano.</p>
<p><b>She can draw well.</b> – Cô ấy vẽ giỏi.</p>
<p>⚠️ Sau "can" <b>KHÔNG</b> thêm -s/-es hay to: can play (✓) / can plays (✗)</p>`,
    [mcq('"He can ___ English well."',['speaks','speaking','speak','to speak'],'speak','Sau can → V nguyên mẫu.'),
     fill('"___ you ride a bike?" – "Yes, I can."','Can','"Can you...?" = câu hỏi khả năng.')]),

  L('4','Câu hỏi What subjects','Unit 6: Our school subjects',
    'Cấu trúc câu hỏi với danh từ số nhiều bổ trợ.',
    `<h3>What subjects do you have?</h3>
<p><b>What subjects do you have today?</b> – Hôm nay bạn có những môn gì?</p>
<p><b>I have Maths, English and Science.</b></p>
<p><b>What is your favourite subject?</b> – Môn học yêu thích của bạn là gì?</p>`,
    [fill('"What ___ do you study?" (subjects – môn học)','subjects','"What subjects" = những môn học gì.'),
     mcq('"What subjects ___ you have today?"',['is','does','do','are'],'do','I/You → do.')]),

  L('4','Why – Because & Sở thích','Unit 7: Our favourite subjects',
    'Cấu trúc hỏi lý do Why và trả lời với Because.',
    `<h3>Why do you like...? / Because...</h3>
<p><b>Why do you like Maths?</b> – Tại sao bạn thích Toán?</p>
<p><b>Because it is interesting.</b> – Vì nó thú vị.</p>
<p><b>Because I am good at it.</b> – Vì tôi giỏi môn đó.</p>`,
    [fill('"Why do you like PE?" – "___ I love sports."','Because','"Because" = Vì (trả lời Why).'),
     mcq('"___ do you like English?" (Tại sao)',['What','Who','Why','Where'],'Why','"Why" = tại sao.')]),

  L('4','Hiện tại tiếp diễn – câu hỏi','Unit 8: My favourite books',
    'Câu hỏi thì Hiện tại tiếp diễn và tính từ mô tả tính cách.',
    `<h3>What is he doing? / What is he like?</h3>
<p><b>What is she doing?</b> → <b>She is reading.</b></p>
<p><b>What is the book like?</b> → <b>It is exciting.</b></p>
<p>Tính từ: exciting, interesting, boring, funny, sad</p>`,
    [fill('"What ___ he doing?" (is/are)','is','He (số ít) → is.'),
     mcq('"What is the story like?" → "___ very funny."',['He is','It is','They are','She is'],'It is','Chủ ngữ "the story" → It is.')]),

  L('4','To-be quá khứ was/were','Unit 9: Our sports and games',
    'Làm quen To-be ở quá khứ đơn: was/were.',
    `<h3>Was / Were – Quá khứ của To-be</h3>
<p>I/He/She/It + <b>was</b> &nbsp;|&nbsp; We/You/They + <b>were</b></p>
<p><b>The game was exciting.</b> – Trận đấu thật hấp dẫn.</p>
<p><b>We were at the sports day yesterday.</b></p>`,
    [mcq('"The match ___ great yesterday."',['is','are','was','were'],'was','Quá khứ số ít → was.'),
     fill('"We ___ very tired after the race."','were','We → were (quá khứ).')]),

  L('4','Quá khứ đơn – động từ thường','Unit 10: Our summer holidays',
    'Làm quen Thì Quá khứ đơn với động từ thường.',
    `<h3>Past Simple – V-ed</h3>
<p>Thêm <b>-ed</b>: visit → visited, play → played, watch → watched</p>
<p><b>I visited my grandparents.</b> – Tôi đã thăm ông bà.</p>
<p><b>We played on the beach.</b> – Chúng tôi đã chơi trên bãi biển.</p>
<p>Dấu hiệu: <b>yesterday, last week, ago, last summer</b></p>`,
    [fill('"We ___ (play) football last week."','played','play + ed = played.'),
     mcq('"She ___ her grandparents last summer."',['visit','visits','visited','is visiting'],'visited','"last summer" → quá khứ đơn: visited.')]),

  L('4','Hiện tại tiếp diễn – di chuyển','Unit 11: Places in my community',
    'Dùng Hiện tại tiếp diễn để diễn tả hành động di chuyển đang diễn ra.',
    `<h3>Going / Coming / Walking...</h3>
<p><b>He is going to the market.</b> – Anh ấy đang đi chợ.</p>
<p><b>They are walking to school.</b> – Họ đang đi bộ đến trường.</p>
<p><b>Where is she going?</b> – Cô ấy đang đi đâu?</p>`,
    [fill('"She is ___ (go) to the library."','going','go → going.'),
     mcq('"They ___ (walk) in the park now."',['walk','walked','are walking','is walking'],'are walking','They + are + V-ing.')]),

  L('4','Hiện tại đơn ngôi 3 & Does','Unit 12: Jobs',
    'Thì Hiện tại đơn ngôi thứ ba số ít và trợ động từ Does.',
    `<h3>He/She + V-s/es / Does</h3>
<p><b>A doctor helps sick people.</b> – Bác sĩ giúp người bệnh.</p>
<p><b>Does she work at a hospital?</b> → <b>Yes, she does.</b></p>
<p>⚠️ He/She/It → thêm <b>-s/-es</b>; câu hỏi/phủ định dùng <b>does</b></p>`,
    [fill('"A teacher ___ (teach) students."','teaches','teach → teaches (ngôi 3 số ít).'),
     mcq('"___ he drive a bus?"',['Do','Is','Does','Has'],'Does','He (ngôi 3 số ít) → Does.')]),

  L('4','To-be + tính từ vs Has + danh từ','Unit 13: Appearance',
    'Phân biệt To-be với tính từ và Has với cụm danh từ chỉ ngoại hình.',
    `<h3>Be + Adj / Have + N</h3>
<p><b>She is tall and beautiful.</b> – Cô ấy cao và xinh đẹp. (to-be + tính từ)</p>
<p><b>She has long hair.</b> – Cô ấy có tóc dài. (has + danh từ)</p>
<p><b>He is fat.</b> vs <b>He has a big nose.</b></p>`,
    [mcq('"She ___ blue eyes." (có)',['is','are','has','have'],'has','"has" + đặc điểm ngoại hình.'),
     fill('"He ___ very tall." (là/trông)','is','"is" + tính từ mô tả.')]),

  L('4','Hiện tại tiếp diễn – khẳng định & nghi vấn','Unit 14: Daily activities',
    'Củng cố dạng khẳng định và nghi vấn của thì Hiện tại tiếp diễn.',
    `<h3>Am/Is/Are + V-ing</h3>
<p><b>I am cooking dinner.</b> – Tôi đang nấu cơm.</p>
<p><b>Are you watching TV?</b> → <b>Yes, I am.</b> / <b>No, I'm not.</b></p>
<p><b>What is your mum doing?</b> → <b>She is cleaning.</b></p>`,
    [fill('"___ your dad reading a newspaper?"','Is','He/She/It → Is... in câu hỏi.'),
     mcq('"Are they cooking?" → "No, they ___."',['aren\'t','isn\'t','don\'t','doesn\'t'],"aren't",'They → aren\'t (are not).')]),

  L('4','Trạng từ chỉ tần suất','Unit 15: My family\'s activities',
    'Các trạng từ chỉ tần suất: always, usually, sometimes, never.',
    `<h3>Adverbs of Frequency</h3>
<table border="1" cellpadding="4" style="border-collapse:collapse">
<tr><th>Trạng từ</th><th>Nghĩa</th><th>Tần suất</th></tr>
<tr><td>always</td><td>luôn luôn</td><td>100%</td></tr>
<tr><td>usually</td><td>thường thường</td><td>80%</td></tr>
<tr><td>sometimes</td><td>đôi khi</td><td>50%</td></tr>
<tr><td>never</td><td>không bao giờ</td><td>0%</td></tr>
</table>
<p>Vị trí: trước động từ thường, sau to-be.</p>`,
    [mcq('"She ___ eats vegetables." (luôn luôn)',['never','sometimes','always','usually'],'always','"always" = luôn luôn (100%).'),
     fill('"I am ___ late for school." (không bao giờ)','never','"never" đứng sau to-be.')]),

  L('4','Câu điều kiện thời gian đơn giản','Unit 16: Weather',
    'Câu điều kiện thời gian đơn giản được lồng ghép vào chủ đề thời tiết.',
    `<h3>When/If + thời tiết...</h3>
<p><b>When it rains, I stay at home.</b></p>
<p><b>If it is sunny, we go to the beach.</b></p>
<p>Cấu trúc: <b>When/If + Hiện tại đơn, Hiện tại đơn</b></p>`,
    [fill('"When it ___ (snow), we build a snowman."','snows','Hiện tại đơn sau When: snows.'),
     mcq('"If it ___ cold, I wear a coat."',['is','was','will be','would be'],'is','Điều kiện đơn giản: If + Hiện tại đơn.')]),

  L('4','How much & Is/Are','Unit 17: In the shopping mall',
    'Hỏi giá tiền với How much và sự thay đổi To-be.',
    `<h3>How much is/are...?</h3>
<p><b>How much is this shirt?</b> – Áo này bao nhiêu tiền?</p>
<p><b>It is 50,000 dong.</b></p>
<p><b>How much are these shoes?</b> – Đôi giày này bao nhiêu?</p>
<p><b>They are 200,000 dong.</b></p>`,
    [fill('"How much ___ this book?" (số ít)','is','Số ít → is.'),
     mcq('"How much ___ these toys?" (số nhiều)',['is','am','are','be'],'are','Số nhiều → are.')]),

  L('4','Would you like...','Unit 18: Food and drinks',
    'Mẫu câu đề nghị, gọi món lịch sự với Would you like...',
    `<h3>Would you like...?</h3>
<p><b>Would you like some rice?</b> – Bạn có muốn cơm không?</p>
<p><b>Yes, please.</b> / <b>No, thank you.</b></p>
<p><b>I would like some noodles.</b> – Tôi muốn một ít mì.</p>`,
    [fill('"Would you ___ some water?" (like)','like','"Would you like...?" = mời lịch sự.'),
     mcq('"Would you like some cake?" – "___, please."',['No','Yes','Not','Maybe'],'Yes','Đồng ý lịch sự: Yes, please.')]),

  L('4','Which... A or B?','Unit 19: Our attraction places',
    'Từ để hỏi mang tính lựa chọn với Which... A or B?',
    `<h3>Which... A or B?</h3>
<p><b>Which do you prefer, mountains or beaches?</b></p>
<p><b>I prefer mountains.</b> – Tôi thích núi hơn.</p>
<p><b>Which is more beautiful?</b> – Cái nào đẹp hơn?</p>`,
    [fill('"___ place do you like, Ha Long or Hoi An?" (Which)','Which','"Which" = Cái nào (chọn trong số).'),
     mcq('"Which do you prefer, sea or mountains?" – "I ___ the sea."',['prefer','prefers','preferred','preferring'],'prefer','I → prefer (không thêm s).')]),

  L('4','Hiện tại tiếp diễn – kế hoạch tương lai','Unit 20: Our summer vacations',
    'Dùng Hiện tại tiếp diễn để diễn tả kế hoạch chắc chắn trong tương lai gần.',
    `<h3>Present Continuous for Future Plans</h3>
<p><b>I am going to Da Nang next week.</b> – Tôi sẽ đi Đà Nẵng tuần tới.</p>
<p><b>She is flying to Ha Noi tomorrow.</b> – Cô ấy bay đến Hà Nội ngày mai.</p>
<p>Dấu hiệu: <b>tomorrow, next week, this summer</b></p>`,
    [fill('"We ___ (travel) to Hue next month."','are travelling','We + are + V-ing = kế hoạch tương lai.'),
     mcq('"They ___ visiting Hoi An next weekend."',['is','am','are','were'],'are','They → are.')]),

  // ── Khối 5 (20 units) ────────────────────────────────────────────────────────
  L('5','Giới từ chỉ địa chỉ','Unit 1: All about us',
    'Giới từ đi với địa chỉ: at + số nhà, on + tên đường, in + thành phố.',
    `<h3>Prepositions with Addresses</h3>
<p><b>at</b> 15 Nguyen Hue Street (số nhà)</p>
<p><b>on</b> Tran Hung Dao Street (tên đường)</p>
<p><b>in</b> Ho Chi Minh City (tên thành phố)</p>
<p>I live at 12 Ly Tu Trong, <b>on</b> Ly Tu Trong Street, <b>in</b> Da Nang.</p>`,
    [fill('"She lives ___ 5 Le Loi Street." (số nhà)','at','"at" + số nhà.'),
     mcq('"He lives ___ Ha Noi." (tên thành phố)',['at','on','in','by'],'in','"in" + tên thành phố/quốc gia.')]),

  L('5','How often – tần suất','Unit 2: Our routines',
    'Câu hỏi tần suất How often và cách trả lời bằng cụm từ chỉ số lần.',
    `<h3>How often...?</h3>
<p><b>How often do you exercise?</b> – Bạn tập thể dục bao lâu một lần?</p>
<p><b>Twice a week.</b> – Hai lần một tuần.</p>
<p><b>Three times a day.</b> – Ba lần một ngày.</p>
<p><b>Once a month.</b> – Một lần một tháng.</p>`,
    [fill('"How ___ do you brush your teeth?"','often','"How often" = bao lâu một lần.'),
     mcq('"How often do you swim?" → "___ a week." (3 lần)',['Three time','Three times','Third times','Third time'],'Three times','Số lần: once, twice, three times...')]),

  L('5','Hiện tại đơn ngôi 3 & Quốc tịch','Unit 3: My foreign friends',
    'Thì Hiện tại đơn ngôi ba số ít và phân biệt Quốc gia/Quốc tịch.',
    `<h3>He/She + V-s/es & Nationalities</h3>
<p><b>She speaks French.</b> – Cô ấy nói tiếng Pháp.</p>
<p><b>He comes from Japan. He is Japanese.</b></p>
<table border="1" cellpadding="4" style="border-collapse:collapse">
<tr><th>Quốc gia</th><th>Quốc tịch</th></tr>
<tr><td>Japan</td><td>Japanese</td></tr>
<tr><td>Korea</td><td>Korean</td></tr>
<tr><td>England</td><td>English</td></tr>
</table>`,
    [fill('"She ___ (speak) three languages."','speaks','She → speaks (ngôi 3 số ít).'),
     mcq('"He is from France. He is ___."',['France','Francish','French','Frenchman'],'French','France → French.')]),

  L('5','Likes + V-ing ngôi 3','Unit 4: Our free-time activities',
    'Động từ chỉ sự yêu thích đi với ngôi số ba số ít: likes + V-ing.',
    `<h3>She likes + V-ing</h3>
<p><b>She likes reading books.</b> – Cô ấy thích đọc sách.</p>
<p><b>He likes playing chess.</b> – Anh ấy thích chơi cờ.</p>
<p>⚠️ Ngôi 3 số ít: like → <b>likes</b> (thêm s) + V-<b>ing</b></p>`,
    [fill('"He ___ (like) painting pictures."','likes','He → likes (ngôi 3 số ít).'),
     mcq('"She likes ___ (cook)."',['cook','cooks','cooked','cooking'],'cooking','likes + V-ing: cooking.')]),

  L('5','Would like to + V nguyên thể','Unit 5: My future job',
    'Cấu trúc ước muốn tương lai: Would like to + Động từ nguyên thể.',
    `<h3>Would like to + V</h3>
<p><b>I would like to be a doctor.</b> – Tôi muốn trở thành bác sĩ.</p>
<p><b>She would like to work abroad.</b> – Cô ấy muốn làm việc ở nước ngoài.</p>
<p>⚠️ Would like to + V (nguyên mẫu, không chia)</p>`,
    [fill('"I would like ___ (be) an engineer."','to be','"would like to" + V nguyên mẫu.'),
     mcq('"He would like to ___ a pilot."',['is','be','being','been'],'be','"to be" = to + V nguyên mẫu.')]),

  L('5','Quá khứ đơn – câu hỏi Yes/No','Unit 6: Our school festival',
    'Thì Quá khứ đơn dạng câu hỏi Yes/No.',
    `<h3>Did + S + V?</h3>
<p><b>Did you enjoy the festival?</b> – Bạn có thích lễ hội không?</p>
<p><b>Yes, I did.</b> / <b>No, I didn't.</b></p>
<p><b>Did she sing a song?</b> → <b>Yes, she did.</b></p>`,
    [fill('"___ you take part in the show?" (Did)','Did','"Did + S + V?" = câu hỏi quá khứ đơn.'),
     mcq('"Did they win the competition?" → "No, they ___."',['didn\'t','don\'t','weren\'t','aren\'t'],"didn't",'Phủ định: No, they didn\'t.')]),

  L('5','Quá khứ đơn – động từ bất quy tắc','Unit 7: My weekend',
    'Phân biệt và chia động từ bất quy tắc trong thì Quá khứ đơn.',
    `<h3>Irregular Verbs – Past Simple</h3>
<table border="1" cellpadding="4" style="border-collapse:collapse">
<tr><th>Nguyên mẫu</th><th>Quá khứ</th><th>Nghĩa</th></tr>
<tr><td>go</td><td>went</td><td>đi</td></tr>
<tr><td>see</td><td>saw</td><td>thấy</td></tr>
<tr><td>eat</td><td>ate</td><td>ăn</td></tr>
<tr><td>buy</td><td>bought</td><td>mua</td></tr>
<tr><td>meet</td><td>met</td><td>gặp</td></tr>
</table>`,
    [fill('"I ___ (go) to the cinema last Saturday."','went','go → went (bất quy tắc).'),
     mcq('"She ___ a new dress last weekend." (buy)',['buyed','buys','bought','buy'],'bought','buy → bought (bất quy tắc).')]),

  L('5','Quá khứ đơn – kể chuyện','Unit 8: My favourite fables',
    'Dùng Quá khứ đơn và trạng từ liên kết để kể lại câu chuyện.',
    `<h3>Storytelling – Past Simple</h3>
<p>Trạng từ liên kết: <b>first, then, next, after that, finally</b></p>
<p><b>First</b>, the tortoise started running slowly.<br>
<b>Then</b>, the hare fell asleep.<br>
<b>Finally</b>, the tortoise won the race.</p>`,
    [fill('"___ the fox found a piece of cheese." (First)','First','Dùng First để bắt đầu chuỗi sự kiện.'),
     mcq('Trạng từ nào dùng để kết thúc câu chuyện?',['First','Then','Next','Finally'],'Finally','"Finally" = cuối cùng.')]),

  L('5','Tương lai gần – Be going to','Unit 9: Our teachers\' day',
    'Thì Tương lai gần: Be going to + V-inf để diễn tả kế hoạch đã có chuẩn bị.',
    `<h3>Be going to + V</h3>
<p>S + <b>am/is/are going to</b> + V (nguyên mẫu)</p>
<p><b>We are going to make a card for our teacher.</b></p>
<p><b>She is going to sing a song at the ceremony.</b></p>
<p>Dùng khi: kế hoạch đã có / dự đoán có căn cứ rõ ràng.</p>`,
    [fill('"I ___ going to decorate the classroom."','am','I → am going to.'),
     mcq('"They ___ going to prepare a gift."',['is','am','are','be'],'are','They → are going to.')]),

  L('5','Tương lai đơn – Will','Unit 10: Our school trips',
    'Thì Tương lai đơn: Will + V-inf cho dự đoán và quyết định bộc phát.',
    `<h3>Will + V</h3>
<p>S + <b>will</b> + V (nguyên mẫu)</p>
<p><b>I think it will be sunny tomorrow.</b> (dự đoán)</p>
<p><b>"I'm tired." – "I'll carry your bag."</b> (quyết định bộc phát)</p>
<p>Phủ định: <b>won't</b> = will not</p>`,
    [fill('"It ___ be a great trip." (will)','will','will + V nguyên mẫu.'),
     mcq('"I think she ___ win the prize."',['is','going to','will','would'],'will','Dự đoán không chắc chắn → will.')]),

  L('5','Should / Shouldn\'t','Unit 11: Our health',
    'Cấu trúc đưa ra lời khuyên với Should và Shouldn\'t.',
    `<h3>Should / Shouldn't + V</h3>
<p><b>You should eat more vegetables.</b> – Bạn nên ăn nhiều rau hơn.</p>
<p><b>You shouldn't eat too much sugar.</b> – Bạn không nên ăn quá nhiều đường.</p>
<p>⚠️ should/shouldn't + V nguyên mẫu (không chia)</p>`,
    [fill('"You ___ exercise every day." (nên)','should','"should" = nên (lời khuyên).'),
     mcq('"You ___ stay up late." (không nên)',['should','must','shouldn\'t','mustn\'t'],"shouldn't",'"shouldn\'t" = không nên.')]),

  L('5','Don\'t + mệnh lệnh & May','Unit 12: Safety at home',
    "Câu mệnh lệnh phủ định bắt đầu bằng Don't và từ chỉ khả năng rủi ro May.",
    `<h3>Don't + V / May (rủi ro)</h3>
<p><b>Don't touch the stove!</b> – Đừng chạm vào bếp!</p>
<p><b>Don't play near the stairs.</b> – Đừng chơi gần cầu thang.</p>
<p><b>It may be dangerous.</b> – Nó có thể nguy hiểm.</p>`,
    [fill('"___ run near the swimming pool!" (Đừng)','Don\'t','"Don\'t + V" = câu mệnh lệnh phủ định.'),
     mcq('"It ___ cause an accident." (có thể)',['will','must','may','should'],'may','"may" = có thể (khả năng).')]),

  L('5','Đại từ sở hữu','Unit 13: Inside our house',
    'Đại từ sở hữu: mine, yours, his, hers, theirs.',
    `<h3>Possessive Pronouns</h3>
<table border="1" cellpadding="4" style="border-collapse:collapse">
<tr><th>Tính từ SH</th><th>Đại từ SH</th></tr>
<tr><td>my</td><td>mine</td></tr>
<tr><td>your</td><td>yours</td></tr>
<tr><td>his</td><td>his</td></tr>
<tr><td>her</td><td>hers</td></tr>
<tr><td>their</td><td>theirs</td></tr>
</table>
<p>"This book is <b>mine</b>." = "This is <b>my</b> book."</p>`,
    [mcq('"That pen is ___." (của bạn)',['your','you','yours','yourself'],'yours','"yours" = đại từ sở hữu ngôi 2.'),
     fill('"This coat is ___." (của cô ấy)','hers','"hers" = đại từ SH của her.')]),

  L('5','Câu mệnh lệnh chỉ đường','Unit 14: Our community',
    'Câu mệnh lệnh chỉ đường và cụm từ định vị không gian.',
    `<h3>Giving Directions</h3>
<p><b>Go straight ahead.</b> – Đi thẳng.</p>
<p><b>Turn left.</b> – Rẽ trái. &nbsp; <b>Turn right.</b> – Rẽ phải.</p>
<p><b>It is on the left/right.</b> – Ở phía trái/phải.</p>
<p><b>Take the second turning on the right.</b></p>`,
    [fill('"___ right at the traffic lights." (Rẽ)','Turn','"Turn right" = Rẽ phải.'),
     mcq('"Go ___ ahead, then turn left."',['straight','direct','forward','next'],'straight','"Go straight" = Đi thẳng.')]),

  L('5','How far & Giới từ phương tiện','Unit 15: Transport',
    'Hỏi khoảng cách How far và giới từ chỉ phương tiện by/on.',
    `<h3>How far...? / By / On</h3>
<p><b>How far is it to school?</b> – Đến trường bao xa?</p>
<p><b>It is 2 kilometres.</b></p>
<p><b>by</b> + phương tiện: by bus, by car, by plane</p>
<p><b>on</b> foot (đi bộ), on a bike (đi xe đạp)</p>`,
    [fill('"How ___ is it to the airport?"','far','"How far" = bao xa.'),
     mcq('"I go to school ___ bus." (bằng xe buýt)',['on','in','at','by'],'by','"by bus/car/plane" = bằng xe buýt/ô tô/máy bay.')]),

  L('5','So sánh hơn – tính từ dài','Unit 16: Places of interest',
    'Câu so sánh hơn với tính từ dài: more + Adj + than.',
    `<h3>Comparative – Tính từ dài</h3>
<p>Tính từ dài (≥2 âm tiết): <b>more</b> + Adj + <b>than</b></p>
<p><b>Ha Long Bay is more beautiful than Cat Ba.</b></p>
<p>Tính từ ngắn (1 âm tiết): Adj + <b>-er</b> + than</p>
<p><b>This mountain is higher than that one.</b></p>`,
    [fill('"Hanoi is ___ exciting ___ my hometown." (more...than)','more / than','"more + Adj + than" cho tính từ dài.'),
     mcq('"Ho Chi Minh City is ___ famous than Hue." (more)',['more','most','very','much'],'more','So sánh hơn tính từ dài → more.')]),

  L('5','Cụm danh từ lượng định','Unit 17: Shopping',
    'Cụm danh từ chỉ lượng định đoạt cho danh từ không đếm được.',
    `<h3>Quantifiers for Uncountable Nouns</h3>
<p><b>a bottle of</b> water/milk/juice</p>
<p><b>a bag of</b> rice/sugar/flour</p>
<p><b>a loaf of</b> bread</p>
<p><b>a piece of</b> cake/cheese</p>
<p>"I'd like <b>a bag of</b> rice." – Tôi muốn một túi gạo.</p>`,
    [fill('"I need two ___ of water." (chai)','bottles','"two bottles of water" = hai chai nước.'),
     mcq('"Please give me ___ bread."',['a loaf of','a bottle of','a bag of','a cup of'],'a loaf of','"a loaf of bread" = một ổ bánh mì.')]),

  L('5','Tính từ phẩm chất đạo đức','Unit 18: Stories and life lessons',
    'Mở rộng vốn tính từ chỉ phẩm chất và đạo đức cá nhân.',
    `<h3>Adjectives – Qualities & Values</h3>
<p><b>honest</b> – trung thực &nbsp; <b>kind</b> – tốt bụng</p>
<p><b>brave</b> – dũng cảm &nbsp; <b>patient</b> – kiên nhẫn</p>
<p><b>clever</b> – thông minh &nbsp; <b>hardworking</b> – chăm chỉ</p>
<p><b>The tortoise was patient and hardworking.</b></p>`,
    [mcq('"He always tells the truth. He is ___."',['lazy','dishonest','honest','mean'],'honest','"honest" = trung thực.'),
     fill('"She helped the old man. She is very ___." (kind)','kind','"kind" = tốt bụng.')]),

  L('5','Will – dự báo thời tiết','Unit 19: Our outdoor activities',
    'Dùng Tương lai đơn Will trong mẫu câu dự báo thời tiết.',
    `<h3>Will for Weather Forecast</h3>
<p><b>It will be sunny tomorrow.</b> – Ngày mai sẽ nắng.</p>
<p><b>It will rain in the afternoon.</b> – Chiều sẽ có mưa.</p>
<p><b>There will be strong winds.</b> – Sẽ có gió mạnh.</p>`,
    [fill('"It ___ be cloudy this weekend." (will)','will','will + V nguyên mẫu.'),
     mcq('"There ___ be thunderstorms tonight."',['is','are','will','going to'],'will','"There will be" = sẽ có.')]),

  L('5','Would like to & Be going to','Unit 20: Our dream summer vacations',
    'Phối hợp giữa Would like to và Be going to để diễn tả ước muốn và kế hoạch.',
    `<h3>Would like to vs Be going to</h3>
<p><b>Would like to</b> = muốn/mong muốn (chưa lên kế hoạch)</p>
<p><b>I would like to visit Paris one day.</b></p>
<p><b>Be going to</b> = kế hoạch đã có sẵn</p>
<p><b>I am going to fly to Singapore next month.</b></p>`,
    [mcq('"I ___ like to see the Eiffel Tower someday." (mong muốn)',['would','am going to','will','going'],'would','"would like to" = mong muốn.'),
     fill('"She ___ going to book the tickets tomorrow." (kế hoạch)','is','She → is going to.')]),

  // ── Khối 6 ──────────────────────────────────────────────────────────────────
  L('6','Động từ To Be','Động từ To Be – am, is, are',
    'Học cách dùng am, is, are để diễn tả trạng thái, nghề nghiệp và nơi chốn.',
    `<h3>Cấu trúc</h3>
<table border="1" cellpadding="6" style="border-collapse:collapse">
  <tr><th>Chủ ngữ</th><th>To Be</th><th>Ví dụ</th></tr>
  <tr><td>I</td><td>am</td><td>I am a student.</td></tr>
  <tr><td>He / She / It</td><td>is</td><td>She is my teacher.</td></tr>
  <tr><td>We / You / They</td><td>are</td><td>They are happy.</td></tr>
</table>
<h3>Phủ định: S + am/is/are + not</h3>
<p>I am not tired. / She is not at home.</p>
<h3>Nghi vấn: Am/Is/Are + S + ...?</h3>
<p>Are you a teacher? → Yes, I am. / No, I am not.</p>`,
    [mcq('Điền đúng: "She ___ my best friend."',['am','is','are','be'],'is','She (ngôi 3 số ít) → is.'),
     fill('Điền: "They ___ happy today."','are','They → are.'),
     mcq('Câu phủ định của "I am tired":',['I am not tired','I is not tired','I are not tired','I not tired'],'I am not tired','I am → phủ định: I am not.')],
    'https://www.youtube.com/watch?v=UlCLhKGLJCM',
  ),

  L('6','Thì hiện tại đơn','Thì hiện tại đơn – Present Simple',
    'Diễn tả thói quen, hành động lặp lại và sự thật hiển nhiên.',
    `<h3>Cấu trúc</h3>
<p><b>Khẳng định:</b> S + V(s/es)</p>
<p><b>Phủ định:</b> S + do/does + not + V</p>
<p><b>Nghi vấn:</b> Do/Does + S + V?</p>
<blockquote>She <b>goes</b> to school every day.<br>I <b>do not</b> like coffee.<br><b>Does</b> he play football?</blockquote>
<h3>Dấu hiệu: always, usually, often, sometimes, never, every day/week</h3>`,
    [mcq('Điền đúng: "He ___ TV every night."',['watch','watches','watching','watched'],'watches','He (ngôi 3 số ít) → watches.'),
     fill('Điền: "She ___ (study) English every day."','studies','study → studies (y → ies, ngôi 3 số ít).'),
     mcq('Câu phủ định: "They ___ play football on Sunday."',['not','don\'t','doesn\'t','isn\'t'],"don't","They → don't.")],
    'https://www.youtube.com/watch?v=aDXRUFBMHa4',
  ),

  L('6','Mạo từ','Mạo từ a, an, the',
    'Phân biệt cách dùng mạo từ xác định và không xác định.',
    `<h3>A / AN – Mạo từ không xác định</h3>
<p><b>A</b>: trước phụ âm — a book, a car</p>
<p><b>AN</b>: trước nguyên âm — an apple, an egg, an hour</p>
<h3>THE – Mạo từ xác định</h3>
<p>Dùng khi danh từ đã xác định hoặc chỉ có một: the sun, the moon.</p>
<p>I have a dog. <b>The</b> dog is cute. (nhắc lại lần 2)</p>`,
    [mcq('Điền: "___ apple a day keeps the doctor away."',['A','An','The','Ø'],'An','"apple" bắt đầu bằng nguyên âm → an.'),
     fill('"___ sun rises in the east."','The','The sun – duy nhất → the.'),
     mcq('Câu nào SAI?',['I see a cat.','The cat is white.','She is an teacher.','He has a book.'],'She is an teacher.','"teacher" bắt đầu bằng phụ âm → a teacher.')]),

  // ── Khối 7 ──────────────────────────────────────────────────────────────────
  L('7','Thì','Thì hiện tại tiếp diễn – Present Continuous',
    'Diễn tả hành động đang xảy ra tại thời điểm nói.',
    `<h3>Cấu trúc</h3>
<p><b>Khẳng định:</b> S + am/is/are + V-ing</p>
<p><b>Phủ định:</b> S + am/is/are + not + V-ing</p>
<p><b>Nghi vấn:</b> Am/Is/Are + S + V-ing?</p>
<blockquote>I <b>am studying</b> English now.<br>She <b>is not watching</b> TV.<br><b>Are</b> they <b>playing</b> football?</blockquote>
<h3>Dấu hiệu: now, at the moment, right now, Look!, Listen!</h3>`,
    [mcq('"She ___ (read) a book now."',['read','reads','is reading','was reading'],'is reading','She + is + V-ing.'),
     fill('"They ___ (play) football at the moment."','are playing','They + are + V-ing.'),
     mcq('Dấu hiệu nào thuộc thì hiện tại tiếp diễn?',['yesterday','every day','right now','last week'],'right now','"right now" → hiện tại tiếp diễn.')],
    'https://www.youtube.com/watch?v=lIW5BHNxVFM',
  ),

  L('7','Thì','Thì quá khứ đơn – Past Simple',
    'Diễn tả hành động đã xảy ra và kết thúc trong quá khứ.',
    `<h3>Cấu trúc</h3>
<p><b>Khẳng định:</b> S + V-ed / V2</p>
<p><b>Phủ định:</b> S + didn't + V</p>
<p><b>Nghi vấn:</b> Did + S + V?</p>
<blockquote>They <b>played</b> football yesterday.<br>She <b>didn't go</b> to school.<br><b>Did</b> you <b>see</b> him?</blockquote>
<h3>Dấu hiệu: yesterday, last night/week/year, ago, in 2010</h3>`,
    [mcq('"She ___ to Ha Noi last year."',['go','goes','went','gone'],'went','go → went (bất quy tắc).'),
     fill('"They ___ (not play) tennis yesterday."','didn\'t play',"Phủ định quá khứ: didn't + V."),
     mcq('Dấu hiệu "ago" dùng với thì nào?',['Hiện tại đơn','Hiện tại tiếp diễn','Quá khứ đơn','Tương lai'],'Quá khứ đơn','"ago" = cách đây... → quá khứ đơn.')],
    'https://www.youtube.com/watch?v=PkFGdptq4JA',
  ),

  L('7','Động từ khuyết thiếu','Modal Verbs – can, must, should',
    'Sử dụng các động từ khuyết thiếu để diễn tả khả năng, bắt buộc và lời khuyên.',
    `<h3>CAN – Khả năng</h3>
<p>S + <b>can</b> + V: She <b>can</b> swim. (Cô ấy bơi giỏi.)</p>
<h3>MUST – Bắt buộc</h3>
<p>S + <b>must</b> + V: You <b>must</b> wear a helmet.</p>
<h3>SHOULD – Lời khuyên</h3>
<p>S + <b>should</b> + V: You <b>should</b> sleep early.</p>
<p>⚠️ Sau can/must/should, động từ luôn ở nguyên mẫu.</p>`,
    [mcq('"You ___ brush your teeth every day." (lời khuyên)',['can','must','should','are'],'should','"should" = lời khuyên.'),
     fill('"She ___ speak French." (có thể)','can','"can" = có khả năng.'),
     mcq('"Students ___ be quiet in the library." (bắt buộc)',['should','can','must','do'],'must','"must" = phải.')]),

  L('7','So sánh','So sánh hơn và so sánh nhất',
    'Cách so sánh hai đối tượng và so sánh trong nhóm từ ba trở lên.',
    `<h3>Comparative – So sánh hơn</h3>
<p>Tính từ ngắn: Adj + <b>-er</b> than &nbsp; | &nbsp; Tính từ dài: <b>more</b> + Adj than</p>
<h3>Superlative – So sánh nhất</h3>
<p>Tính từ ngắn: <b>the</b> + Adj + <b>-est</b> &nbsp; | &nbsp; Tính từ dài: <b>the most</b> + Adj</p>
<h3>Bất quy tắc: good → better → the best &nbsp; bad → worse → the worst</h3>`,
    [mcq('"Mount Everest is ___ mountain in the world."',['tall','taller','the tallest','most tall'],'the tallest','So sánh nhất: the tallest.'),
     fill('"This book is ___ (interesting) than that one."','more interesting','"interesting" dài → more interesting.'),
     mcq('So sánh hơn của "good":',['gooder','more good','better','best'],'better','good → better (bất quy tắc).')],
    'https://www.youtube.com/watch?v=0LqMHF-iyBo',
  ),

  // ── Khối 8 ──────────────────────────────────────────────────────────────────
  L('8','Thì','Thì hiện tại hoàn thành – Present Perfect',
    'Diễn tả hành động bắt đầu trong quá khứ, liên quan đến hiện tại.',
    `<h3>Cấu trúc</h3>
<p><b>Khẳng định:</b> S + have/has + V3/ed</p>
<p><b>Phủ định:</b> S + have/has + not + V3/ed</p>
<p><b>Nghi vấn:</b> Have/Has + S + V3/ed?</p>
<blockquote>I <b>have studied</b> English for 3 years.<br>She <b>has visited</b> Paris twice.</blockquote>
<h3>Dấu hiệu: for, since, already, yet, just, ever, never, recently</h3>`,
    [mcq('"She ___ in Ha Noi for 5 years."',['lives','lived','has lived','is living'],'has lived','"for 5 years" → hiện tại hoàn thành.'),
     fill('"I ___ (never/eat) sushi before."','have never eaten','have + never + V3.'),
     mcq('"___ you ever been to London?"',['Did','Have','Do','Are'],'Have','Câu hỏi HTHT ngôi 2: Have you...?')],
    'https://www.youtube.com/watch?v=dJzizKiymLA',
  ),

  L('8','Câu bị động','Câu bị động – Passive Voice',
    'Chuyển câu chủ động sang câu bị động.',
    `<h3>Cấu trúc: S + be + V3/ed (+ by O)</h3>
<table border="1" cellpadding="5" style="border-collapse:collapse">
  <tr><th>Thì</th><th>Bị động</th></tr>
  <tr><td>Hiện tại đơn</td><td>is/are + V3</td></tr>
  <tr><td>Quá khứ đơn</td><td>was/were + V3</td></tr>
  <tr><td>Tương lai</td><td>will be + V3</td></tr>
</table>
<p>She cleans the room. → The room <b>is cleaned</b>.</p>`,
    [mcq('"The book ___ (write) by Nam last year."',['wrote','is written','was written','has written'],'was written','Bị động QKĐ: was + V3.'),
     fill('"English ___ (speak) all over the world."','is spoken','Bị động HTĐ: is + V3.'),
     mcq('"The car will ___ repaired tomorrow."',['is','be','been','being'],'be','will + be + V3.')]),

  L('8','Câu điều kiện','Câu điều kiện loại 1 và 2',
    'Câu điều kiện loại 1 (có thể xảy ra) và loại 2 (giả định).',
    `<h3>Loại 1: If + HTĐ, will + V</h3>
<p>If it <b>rains</b>, I <b>will</b> stay at home.</p>
<h3>Loại 2: If + QKĐ, would/could + V</h3>
<p>If I <b>were</b> rich, I <b>would travel</b> the world.</p>
<p>⚠️ "to be" trong ĐK loại 2 luôn dùng <b>were</b> cho mọi chủ ngữ.</p>`,
    [mcq('"If it ___ (rain) tomorrow, we will cancel the trip."',['rains','rained','will rain','would rain'],'rains','ĐK loại 1: If + HTĐ.'),
     fill('"If I ___ (be) you, I would apologize."','were','"to be" loại 2 → were.'),
     mcq('Câu nào là điều kiện loại 2?',['If it rains, I will stay.','If I were rich, I would travel.','If you study, you pass.','If she comes, tell her.'],'If I were rich, I would travel.','Loại 2: If + QKĐ, would + V.')]),

  L('8','Mệnh đề quan hệ','Mệnh đề quan hệ – Relative Clauses',
    'Sử dụng who, which, that, where để bổ sung thông tin cho danh từ.',
    `<h3>Đại từ quan hệ</h3>
<table border="1" cellpadding="5" style="border-collapse:collapse">
  <tr><th>Đại từ</th><th>Thay thế</th></tr>
  <tr><td>who</td><td>người (chủ ngữ)</td></tr>
  <tr><td>which</td><td>vật</td></tr>
  <tr><td>that</td><td>người hoặc vật</td></tr>
  <tr><td>where</td><td>nơi chốn</td></tr>
  <tr><td>whose</td><td>sở hữu</td></tr>
</table>`,
    [mcq('"The woman ___ lives next door is very kind."',['which','who','where','whose'],'who','"who" thay thế người làm chủ ngữ.'),
     fill('"The book ___ you gave me is very useful."','that','"that/which" thay thế vật.'),
     mcq('"This is the city ___ I was born."',['who','which','where','that'],'where','"where" thay thế nơi chốn.')]),

  // ── Khối 9 ──────────────────────────────────────────────────────────────────
  L('9','Câu tường thuật','Câu tường thuật – Reported Speech',
    'Chuyển câu trực tiếp sang gián tiếp, lùi thì và thay đổi đại từ.',
    `<h3>Lùi thì</h3>
<table border="1" cellpadding="5" style="border-collapse:collapse">
  <tr><th>Trực tiếp</th><th>Gián tiếp</th></tr>
  <tr><td>Present Simple</td><td>Past Simple</td></tr>
  <tr><td>Present Continuous</td><td>Past Continuous</td></tr>
  <tr><td>will</td><td>would</td></tr>
  <tr><td>can</td><td>could</td></tr>
</table>
<p>She said, "I am tired." → She said she <b>was</b> tired.</p>`,
    [mcq('She said, "I am happy." → She said she ___ happy.',['is','was','were','am'],'was','Present Simple → Past Simple khi tường thuật.'),
     fill('He said, "I will call you." → He said he ___ call me.','would','will → would trong tường thuật.'),
     mcq('"Are you tired?" → She asked me ___ I was tired.',['that','if','what','when'],'if','Câu hỏi Yes/No → "if/whether".')],
    'https://www.youtube.com/watch?v=dVNDHr8DzUk',
  ),

  L('9','Câu điều kiện','Câu điều kiện loại 3 – Type 3 Conditional',
    'Điều kiện không có thật trong quá khứ – thường bày tỏ sự hối tiếc.',
    `<h3>Cấu trúc: If + had + V3, would/could + have + V3</h3>
<blockquote>If I <b>had studied</b> harder, I <b>would have passed</b>.<br>If she <b>had come</b> earlier, she <b>could have met</b> him.</blockquote>
<h3>Ý nghĩa: Điều kiện không xảy ra trong quá khứ → kết quả cũng không xảy ra.</h3>`,
    [mcq('"If she ___ (study), she would have passed."',['studied','studies','had studied','has studied'],'had studied','ĐK loại 3: If + had + V3.'),
     fill('"If they ___ (leave) earlier, they would have caught the train."','had left','Loại 3: had + V3.'),
     mcq('"I would have called you if I ___ your number."',['know','knew','had known','have known'],'had known','If + had + V3.')]),

  L('9','Câu giả định','Câu giả định – Wish / If only',
    'Diễn tả ước muốn và hối tiếc với wish và if only.',
    `<h3>WISH</h3>
<p>Ước hiện tại (không có thật): S + <b>wish</b> + S + QKĐ</p>
<p>I wish I <b>were</b> taller. &nbsp; She wishes she <b>could</b> fly.</p>
<p>Ước quá khứ (hối tiếc): S + <b>wish</b> + S + <b>had</b> + V3</p>
<p>I wish I <b>had studied</b> harder.</p>
<h3>IF ONLY: If only I <b>were</b> rich! (nhấn mạnh hơn wish)</h3>`,
    [mcq('"I wish I ___ a car." (không có thật hiện tại)',['have','had','have had','will have'],'had','Wish + QKĐ = điều không có thật hiện tại.'),
     fill('"She wishes she ___ (can) sing."','could','Wish hiện tại: wish + could.'),
     mcq('"I wish I ___ studied harder." (hối tiếc quá khứ)',['had','have','did','was'],'had','Wish + had + V3 = hối tiếc quá khứ.')]),

  L('9','Tương lai','Tương lai đơn và tương lai gần',
    'Phân biệt will (tương lai đơn) và be going to (tương lai gần).',
    `<h3>Will – Tương lai đơn</h3>
<p>Dùng cho: quyết định tức thời, lời hứa, dự đoán không có căn cứ.</p>
<p>I think it <b>will</b> rain tomorrow.</p>
<h3>Be going to – Tương lai gần</h3>
<p>Dùng cho: kế hoạch/dự định có sẵn, dự đoán có căn cứ.</p>
<p>I <b>am going to</b> visit grandparents this weekend. (đã lên kế hoạch)</p>`,
    [mcq('"Look! The bus ___. Run!" (dự đoán có căn cứ)',['will come','is going to come','comes','came'],'is going to come','"Look!" = dấu hiệu → be going to.'),
     fill('"I ___ (call) you back in 5 minutes." (lời hứa)','will call','Lời hứa → will.'),
     mcq('Câu nào dùng ĐÚNG "be going to"?',['I think she will pass.','They are going to get married next June.','It will snow tomorrow.','I will open the door.'],'They are going to get married next June.','Kế hoạch đã lên → be going to.')]),
];

async function seed() {
  const col = db.collection(COLLECTIONS.GRAMMAR_LESSONS);
  let added = 0;
  let skipped = 0;

  for (const lesson of LESSONS) {
    const existing = await col
      .where('title', '==', lesson.title)
      .where('gradeLevel', '==', lesson.gradeLevel)
      .limit(1)
      .get();

    if (!existing.empty) {
      console.log(`  SKIP  [${lesson.gradeLevel}] ${lesson.title}`);
      skipped++;
      continue;
    }

    const now = new Date().toISOString();
    const doc = {
      ...lesson,
      exercises: (lesson.exercises || []).map((ex, i) => ({
        id: `seed_ex_${i}_${Date.now()}_${Math.random().toString(36).slice(2)}`,
        ...ex,
        options: ex.options || [],
        explanation: ex.explanation || '',
      })),
      teacherAccountId: TEACHER_ID,
      teacherName: TEACHER_NAME,
      status: 'published',
      weekNumber: null,
      month: null,
      year: new Date().getFullYear(),
      module: '',
      createdAt: now,
      updatedAt: now,
    };

    await col.add(doc);
    console.log(`  ADD   [${lesson.gradeLevel}] ${lesson.title}`);
    added++;
  }

  console.log(`\nDone: ${added} added, ${skipped} skipped.`);
  process.exit(0);
}

seed().catch((err) => { console.error(err); process.exit(1); });