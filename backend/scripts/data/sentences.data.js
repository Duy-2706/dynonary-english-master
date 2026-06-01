/**
 * sentences.data.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Curated conversational sentences with Vietnamese translations.
 * Each sentence is enriched at seed time with:
 *   • audioUrl  — Google Translate TTS link (browser-playable MP3)
 *   • videoUrl  — kid-friendly YouTube video URL associated with the topic
 *
 * Schema written to Firestore:
 *   { sentence, mean, note, topics[], level, audioUrl, videoUrl, isChecked }
 */

'use strict';

// Helper to keep entries on a single readable line
const s = (sentence, mean, note, topics, level) => ({
  sentence, mean, note, topics, level,
});

const SENTENCE_LIST = [
  // ═══════════════════════════════════════════════════════════════════════════
  // GREETINGS  (~30)
  // ═══════════════════════════════════════════════════════════════════════════
  s('Hello! How are you?',                       'Xin chào! Bạn có khỏe không?',                     'Standard informal greeting between friends.',                        ['greetings'], 'A1'),
  s('Good morning! Have a nice day.',            'Chào buổi sáng! Chúc bạn một ngày tốt lành.',     'Polite morning greeting.',                                           ['greetings'], 'A1'),
  s('Good afternoon, everyone.',                 'Chào buổi chiều mọi người.',                       'Used after 12 PM until evening.',                                    ['greetings'], 'A1'),
  s('Good evening!',                             'Chào buổi tối!',                                   'Used from sunset onwards.',                                          ['greetings'], 'A1'),
  s('Good night, sleep well.',                   'Ngủ ngon nhé.',                                    'Said before going to bed.',                                          ['greetings'], 'A1'),
  s('Nice to meet you.',                         'Rất vui được gặp bạn.',                            'Said when meeting someone for the first time.',                     ['greetings'], 'A1'),
  s('What is your name?',                        'Tên bạn là gì?',                                   'Simple question using the verb "to be".',                            ['greetings'], 'A1'),
  s('My name is Anna. I am from Vietnam.',       'Tên tôi là Anna. Tôi đến từ Việt Nam.',           'Self-introduction with "My name is" and "I am from".',               ['greetings'], 'A1'),
  s('How old are you?',                          'Bạn bao nhiêu tuổi?',                              'Question form using "How old".',                                     ['greetings'], 'A1'),
  s('I am ten years old.',                       'Tôi mười tuổi.',                                   '"I am + age + years old" pattern.',                                  ['greetings'], 'A1'),
  s('Where are you from?',                       'Bạn đến từ đâu?',                                  '"Where are you from?" asks about origin/nationality.',               ['greetings'], 'A1'),
  s('Goodbye! See you soon.',                    'Tạm biệt! Hẹn gặp lại.',                           'Casual farewell.',                                                   ['greetings'], 'A1'),
  s('See you tomorrow!',                         'Hẹn gặp lại vào ngày mai!',                        'Informal farewell expression.',                                      ['greetings'], 'A1'),
  s('See you later.',                            'Hẹn gặp lại sau.',                                 'Used when you will see the person again soon.',                      ['greetings'], 'A1'),
  s('Take care!',                                'Bảo trọng nhé!',                                   'Friendly farewell, often used with friends.',                        ['greetings'], 'A1'),
  s('Have a good day!',                          'Chúc một ngày tốt lành!',                          'Universal positive farewell.',                                       ['greetings'], 'A1'),
  s('Please and thank you.',                     'Làm ơn và cảm ơn.',                                'Two essential polite words for kids to learn.',                      ['greetings'], 'A1'),
  s('You are welcome.',                          'Không có chi.',                                    'Response to "Thank you".',                                           ['greetings'], 'A1'),
  s('I am sorry.',                               'Tôi xin lỗi.',                                     'Apology in simple present.',                                         ['greetings'], 'A1'),
  s('Excuse me, please.',                        'Xin phép cho tôi.',                                'Polite way to get attention.',                                       ['greetings'], 'A1'),
  s('How is it going?',                          'Mọi chuyện thế nào rồi?',                          'Casual "How are you?" alternative.',                                 ['greetings'], 'A2'),
  s('I have not seen you in ages!',              'Lâu rồi mình không gặp bạn!',                      'Present perfect with "in ages" = long time.',                        ['greetings'], 'A2'),
  s('How long have you been living here?',       'Bạn đã sống ở đây bao lâu rồi?',                  'Present perfect continuous; asking about duration.',                 ['greetings'], 'B1'),
  s('It is a pleasure to make your acquaintance.','Thật là vinh hạnh được làm quen với bạn.',        'Formal version of "Nice to meet you".',                              ['greetings'], 'B1'),
  s('Please give my regards to your family.',    'Hãy chuyển lời hỏi thăm của tôi đến gia đình bạn.','"Give my regards" is a polite closing phrase.',                      ['greetings'], 'B1'),
  s('Allow me to introduce myself.',             'Cho phép tôi tự giới thiệu.',                      'Formal self-introduction.',                                          ['greetings'], 'B1'),
  s('I look forward to working with you.',       'Tôi mong được cộng tác cùng bạn.',                 '"Look forward to" + gerund; formal closing.',                        ['greetings'], 'B1'),
  s('Long time no see!',                         'Lâu rồi không gặp!',                               'Casual greeting after a long absence.',                              ['greetings'], 'A2'),
  s('Hi! How is everything?',                    'Chào! Mọi việc thế nào?',                          'Casual catch-up phrase.',                                            ['greetings'], 'A2'),
  s('Nice to see you again.',                    'Rất vui gặp lại bạn.',                             'Greeting someone you have met before.',                              ['greetings'], 'A2'),

  // ═══════════════════════════════════════════════════════════════════════════
  // DAILY LIFE  (~25)
  // ═══════════════════════════════════════════════════════════════════════════
  s('I wake up at seven o\'clock every morning.','Tôi thức dậy lúc bảy giờ mỗi buổi sáng.',          'Simple present tense for daily routines.',                           ['daily_life'], 'A1'),
  s('She brushes her teeth before going to bed.','Cô ấy đánh răng trước khi đi ngủ.',                'Simple present + gerund after preposition.',                         ['daily_life'], 'A1'),
  s('We have dinner together as a family.',      'Chúng tôi ăn tối cùng nhau như một gia đình.',     'Simple present; "as a family" is an adverb phrase.',                 ['daily_life'], 'A1'),
  s('He takes the bus to work every day.',       'Anh ấy đi xe buýt đến nơi làm việc mỗi ngày.',     '"Take the bus" is a common collocation.',                            ['daily_life'], 'A1'),
  s('I take a shower every morning before breakfast.','Tôi tắm mỗi buổi sáng trước bữa ăn sáng.',   '"Take a shower" is a common collocation.',                           ['daily_life'], 'A1'),
  s('She woke up late and missed the morning bus.','Cô ấy thức dậy muộn và lỡ chuyến xe buýt buổi sáng.','Past simple; "miss the bus" = lỡ xe buýt.',                       ['daily_life'], 'A1'),
  s('I usually read a book before going to sleep.','Tôi thường đọc sách trước khi đi ngủ.',          '"Usually" marks habitual present actions.',                          ['daily_life'], 'A2'),
  s('She is cooking dinner in the kitchen right now.','Cô ấy đang nấu bữa tối trong bếp ngay lúc này.','Present continuous for an action happening now.',                  ['daily_life'], 'A2'),
  s('What time do you usually have lunch?',      'Bạn thường ăn trưa lúc mấy giờ?',                  'Frequency question with "usually".',                                 ['daily_life'], 'A2'),
  s('I always make my bed in the morning.',      'Tôi luôn dọn giường vào buổi sáng.',               'Frequency adverb "always"; "make the bed" = dọn giường.',           ['daily_life'], 'A2'),
  s('Do not forget to lock the door before leaving.','Đừng quên khóa cửa trước khi đi.',             'Imperative; "before + gerund".',                                     ['daily_life'], 'A2'),
  s('She usually listens to podcasts while commuting to work.','Cô ấy thường nghe podcast khi đi làm.','"While + gerund" expresses simultaneous action.',                  ['daily_life'], 'B1'),
  s('I forgot to pay the electricity bill this month.','Tôi đã quên thanh toán hóa đơn điện tháng này.','"Forget to do" means the action was not done.',                   ['daily_life'], 'B1'),
  s('They have been married for twenty years.',  'Họ đã kết hôn được hai mươi năm rồi.',            'Present perfect for a state continuing to the present.',             ['daily_life'], 'B1'),
  s('On weekends I like to sleep in.',           'Cuối tuần tôi thích ngủ nướng.',                   '"Sleep in" = ngủ dậy muộn.',                                        ['daily_life'], 'B1'),
  s('She always sets her alarm clock for six.',  'Cô ấy luôn đặt báo thức lúc sáu giờ.',            'Habit in simple present.',                                           ['daily_life'], 'A2'),
  s('I have been trying to reduce my screen time before bed.','Tôi đang cố gắng giảm thời gian dùng màn hình trước khi ngủ.','Present perfect continuous for ongoing effort.',      ['daily_life'], 'B2'),
  s('Maintaining a healthy work-life balance is challenging.','Duy trì cân bằng giữa công việc và cuộc sống là điều khó khăn.','Gerund as subject; compound noun.',                  ['daily_life'], 'B2'),
  s('If I had more free time, I would take up painting.','Nếu có nhiều thời gian rảnh hơn, tôi sẽ học vẽ.','Second conditional: if + past simple, would + infinitive.',      ['daily_life'], 'B2'),
  s('My day starts with a strong cup of coffee.','Ngày của tôi bắt đầu bằng một ly cà phê đậm đà.',  'Simple present for routines.',                                       ['daily_life'], 'A2'),
  s('She does the laundry on Sundays.',          'Cô ấy giặt đồ vào Chủ Nhật.',                      '"Do the laundry" = giặt đồ.',                                        ['daily_life'], 'A2'),
  s('He goes jogging in the park every evening.','Anh ấy chạy bộ trong công viên mỗi tối.',          'Habit with frequency phrase.',                                       ['daily_life'], 'A2'),
  s('I drink water as soon as I wake up.',       'Tôi uống nước ngay khi vừa thức dậy.',             '"As soon as" expresses immediacy.',                                  ['daily_life'], 'B1'),
  s('We tidy up the house every weekend.',       'Chúng tôi dọn dẹp nhà cửa mỗi cuối tuần.',         '"Tidy up" is a phrasal verb meaning to clean.',                      ['daily_life'], 'A2'),
  s('She is always late for class.',             'Cô ấy luôn đi học muộn.',                          'Present continuous with always = recurring complaint.',              ['daily_life'], 'B1'),

  // ═══════════════════════════════════════════════════════════════════════════
  // FAMILY  (~20)
  // ═══════════════════════════════════════════════════════════════════════════
  s('I love my family very much.',               'Tôi rất yêu gia đình của mình.',                   'Simple present; "very much" intensifier.',                           ['family'], 'A1'),
  s('My mother is a teacher.',                   'Mẹ tôi là một giáo viên.',                         '"To be" verb introducing profession.',                               ['family'], 'A1'),
  s('My father works in an office.',             'Bố tôi làm việc trong văn phòng.',                 'Simple present; "work in".',                                         ['family'], 'A1'),
  s('I have one brother and two sisters.',       'Tôi có một anh trai và hai chị gái.',              'Use of "have" for possession.',                                      ['family'], 'A1'),
  s('My grandmother lives with us.',             'Bà tôi sống cùng chúng tôi.',                      '"Live with" expresses cohabitation.',                                ['family'], 'A1'),
  s('We visit our grandparents every weekend.',  'Chúng tôi thăm ông bà vào mỗi cuối tuần.',         'Routine with frequency phrase.',                                     ['family'], 'A1'),
  s('My little sister is very cute.',            'Em gái nhỏ của tôi rất dễ thương.',                'Adjective placement before noun.',                                   ['family'], 'A1'),
  s('Do you have any cousins?',                  'Bạn có anh chị em họ nào không?',                  '"Any" in question.',                                                 ['family'], 'A2'),
  s('My uncle lives abroad.',                    'Chú tôi sống ở nước ngoài.',                       '"Abroad" adverb without preposition.',                               ['family'], 'A2'),
  s('I take after my mother.',                   'Tôi giống mẹ tôi.',                                '"Take after" = giống ai (tính cách hay ngoại hình).',               ['family'], 'B1'),
  s('My parents are very supportive.',           'Bố mẹ tôi rất hỗ trợ tôi.',                        '"Supportive" describes character.',                                  ['family'], 'A2'),
  s('We had a big family reunion last summer.',  'Chúng tôi đã có một buổi họp mặt gia đình lớn vào mùa hè năm ngoái.','Past simple; "family reunion" = họp mặt gia đình.',     ['family'], 'B1'),
  s('My grandfather is in his eighties.',        'Ông tôi đã ngoài tám mươi.',                       '"In his eighties" = trong tuổi 80s.',                                ['family'], 'B1'),
  s('She is the eldest of three children.',      'Cô ấy là con cả trong ba người con.',              '"Eldest" superlative for siblings.',                                 ['family'], 'B1'),
  s('They have been married for ten years.',     'Họ đã kết hôn được mười năm.',                     'Present perfect; "for + duration".',                                 ['family'], 'B1'),
  s('My twin sister and I are very close.',      'Tôi và chị em sinh đôi rất thân thiết.',           '"Twin sister"; "very close" = thân thiết.',                          ['family'], 'B1'),
  s('My nephew turned five last week.',          'Cháu trai tôi vừa tròn năm tuổi tuần trước.',       '"Turn + age" = tròn tuổi đó.',                                      ['family'], 'B1'),
  s('Our family has a tradition of cooking dinner together.','Gia đình chúng tôi có truyền thống nấu bữa tối cùng nhau.','"Have a tradition of + gerund".',                  ['family'], 'B2'),
  s('My ancestors came from a small village in the north.','Tổ tiên của tôi đến từ một ngôi làng nhỏ ở phía Bắc.','Past simple; "ancestors" = tổ tiên.',                       ['family'], 'B2'),
  s('Family bonds are stronger than friendship.','Tình cảm gia đình bền chặt hơn tình bạn.',         'Comparative; abstract noun.',                                        ['family'], 'B2'),

  // ═══════════════════════════════════════════════════════════════════════════
  // FOOD  (~25)
  // ═══════════════════════════════════════════════════════════════════════════
  s('I am hungry. What is for lunch?',           'Tôi đói bụng. Bữa trưa có gì vậy?',                'Simple present; informal question about a meal.',                    ['food'], 'A1'),
  s('Do you like spicy food?',                   'Bạn có thích đồ ăn cay không?',                    'Simple present question about preference.',                          ['food'], 'A1'),
  s('Can I have a glass of water, please?',      'Cho tôi một ly nước được không?',                  '"Can I have...?" is the most common restaurant request.',           ['food'], 'A1'),
  s('I love eating pizza on Friday nights.',     'Tôi thích ăn pizza vào tối thứ Sáu.',              'Gerund after "love".',                                              ['food'], 'A1'),
  s('Let us order some sushi for dinner.',       'Hãy gọi ít sushi cho bữa tối nhé.',                'Suggestion with "Let us + verb".',                                  ['food'], 'A1'),
  s('I usually eat breakfast at home before going to work.','Tôi thường ăn sáng ở nhà trước khi đi làm.','Simple present + "before" + gerund.',                            ['food'], 'A2'),
  s('The soup tastes delicious. What is in it?', 'Canh này ngon tuyệt. Nó có những gì vậy?',         '"Taste" as a linking verb.',                                        ['food'], 'A2'),
  s('She is allergic to peanuts and dairy products.','Cô ấy bị dị ứng với lạc và các sản phẩm từ sữa.','"Be allergic to" is a fixed expression.',                          ['food'], 'A2'),
  s('Could we have the bill, please?',           'Cho chúng tôi xin hóa đơn được không?',            'Polite request in a restaurant.',                                   ['food'], 'A2'),
  s('This dish is made from fresh vegetables and herbs.','Món này được làm từ rau tươi và thảo mộc.','Passive voice: "is made from".',                                   ['food'], 'A2'),
  s('I would like to try the local specialty.',  'Tôi muốn thử món đặc sản địa phương.',             '"Would like to" = muốn (lịch sự).',                                 ['food'], 'A2'),
  s('I ordered the wrong dish by mistake.',      'Tôi đã gọi nhầm món.',                             '"By mistake" = vô tình.',                                          ['food'], 'A2'),
  s('I have been trying to eat more vegetables and less red meat.','Tôi đang cố gắng ăn nhiều rau hơn và ít thịt đỏ hơn.','Present perfect continuous.',                       ['food'], 'B1'),
  s('The chef recommends marinating the chicken overnight.','Đầu bếp khuyên nên ướp gà qua đêm.','"Marinate overnight" = ướp qua đêm.',                                  ['food'], 'B1'),
  s('Street food culture in Vietnam is rich and incredibly diverse.','Văn hóa ẩm thực đường phố ở Việt Nam phong phú và đa dạng.','Adjective "diverse" = đa dạng.',         ['food'], 'B2'),
  s('The restaurant was fully booked.',          'Nhà hàng đã kín chỗ.',                             '"Fully booked" = hết chỗ.',                                         ['food'], 'B1'),
  s('Apples are sweet and crunchy.',             'Táo có vị ngọt và giòn.',                          'Linking verb + two adjectives.',                                    ['food'], 'A1'),
  s('She drinks orange juice every morning.',    'Cô ấy uống nước cam mỗi sáng.',                    'Habit in simple present.',                                          ['food'], 'A1'),
  s('Children should eat plenty of fruits and vegetables.','Trẻ em nên ăn nhiều trái cây và rau xanh.','"Should" for advice.',                                            ['food'], 'A2'),
  s('Would you like more rice?',                 'Bạn có muốn thêm cơm không?',                      'Polite offer.',                                                     ['food'], 'A1'),
  s('I do not eat meat. I am a vegetarian.',     'Tôi không ăn thịt. Tôi ăn chay.',                  'Identity statement.',                                               ['food'], 'A2'),
  s('Please pass me the salt.',                  'Vui lòng đưa cho tôi muối.',                       'Polite imperative at the dinner table.',                            ['food'], 'A1'),
  s('The cake smells amazing.',                  'Bánh thơm tuyệt.',                                 '"Smell" as a linking verb.',                                        ['food'], 'A2'),
  s('We had a delicious meal yesterday.',        'Chúng tôi đã có một bữa ăn ngon hôm qua.',         'Past simple; "have a meal".',                                       ['food'], 'A2'),
  s('Do not eat too much chocolate before dinner.','Đừng ăn quá nhiều sô cô la trước bữa tối.',      'Negative imperative; "too much".',                                  ['food'], 'A2'),

  // ═══════════════════════════════════════════════════════════════════════════
  // SCHOOL / EDUCATION  (~25)
  // ═══════════════════════════════════════════════════════════════════════════
  s('I go to school by bicycle.',                'Tôi đi học bằng xe đạp.',                          '"By + means of transport".',                                        ['education'], 'A1'),
  s('What subject do you like the most at school?','Bạn thích môn học nào nhất ở trường?',           '"What ... do you like?" pattern.',                                  ['education'], 'A1'),
  s('I study English for two hours every evening.','Tôi học tiếng Anh hai tiếng đồng hồ mỗi buổi tối.','Simple present + duration + frequency.',                          ['education'], 'A1'),
  s('Open your books to page ten, please.',      'Hãy mở sách trang mười.',                          'Imperative; classroom instruction.',                                ['education'], 'A1'),
  s('My favorite subject is math.',              'Môn học yêu thích của tôi là toán.',               'Identity statement.',                                               ['education'], 'A1'),
  s('Raise your hand if you have a question.',   'Hãy giơ tay nếu bạn có câu hỏi.',                  'Conditional imperative; classroom rule.',                           ['education'], 'A1'),
  s('Please listen carefully.',                  'Hãy lắng nghe cẩn thận.',                          'Polite imperative.',                                                ['education'], 'A1'),
  s('The class starts at half past eight.',      'Lớp học bắt đầu lúc tám giờ rưỡi.',                '"Half past eight" = 8:30 (BrE).',                                   ['education'], 'A1'),
  s('She passed her final exam with high marks.','Cô ấy đã vượt qua kỳ thi cuối kỳ với điểm số cao.','"Pass an exam" + "with high marks".',                              ['education'], 'A2'),
  s('The library opens at nine and closes at eight.','Thư viện mở cửa lúc chín giờ và đóng cửa lúc tám giờ.','Simple present for scheduled openings.',                     ['education'], 'A2'),
  s('I have to finish my homework before dinner.','Tôi phải làm xong bài tập trước bữa tối.',         '"Have to" + base verb; obligation.',                                ['education'], 'A2'),
  s('You can borrow up to five books from the library.','Bạn có thể mượn tối đa năm cuốn sách từ thư viện.','"Borrow from"; "up to" + quantity.',                       ['education'], 'A2'),
  s('Students who fail the exam can retake it in September.','Học sinh thi trượt có thể thi lại vào tháng Chín.','Defining relative clause with "who".',                  ['education'], 'B1'),
  s('He has been studying abroad for the past two years.','Anh ấy đã du học nước ngoài trong hai năm qua.','Present perfect continuous.',                                  ['education'], 'B1'),
  s('The scholarship covers tuition fees and living expenses.','Học bổng chi trả học phí và chi phí sinh hoạt.','"Cover" = bao gồm chi phí.',                                ['education'], 'B1'),
  s('The professor asked the students to submit their assignments online.','Giáo sư yêu cầu sinh viên nộp bài tập trực tuyến.','"Ask someone to do" + "submit online".',     ['education'], 'B1'),
  s('Critical thinking skills are essential in higher education.','Kỹ năng tư duy phản biện thiết yếu trong giáo dục đại học.','"Critical thinking" = tư duy phản biện.', ['education'], 'B2'),
  s('Peer learning helps students understand material more deeply.','Học tập từ bạn bè giúp học sinh hiểu bài sâu hơn.','"Peer learning" = học hỏi cùng nhóm.',           ['education'], 'B2'),
  s('She devoted years of research to developing a new teaching method.','Cô ấy đã dành nhiều năm nghiên cứu để phát triển phương pháp giảng dạy mới.','"Devote ... to" + gerund.',['education'], 'B2'),
  s('The exam results will be published on the school website.','Kết quả thi sẽ được đăng trên trang web nhà trường.','Future passive: "will be published".',           ['education'], 'B1'),
  s('Education is the key to a better future.',  'Giáo dục là chìa khóa cho một tương lai tốt đẹp hơn.','Comparative + abstract noun.',                                  ['education'], 'B1'),
  s('Reading every day improves your vocabulary.','Đọc mỗi ngày sẽ cải thiện vốn từ vựng của bạn.',   'Gerund as subject.',                                                ['education'], 'A2'),
  s('Please write your name at the top of the paper.','Vui lòng viết tên bạn ở đầu trang giấy.',     'Polite imperative; classroom instruction.',                         ['education'], 'A1'),
  s('Practice makes perfect.',                   'Có công mài sắt có ngày nên kim.',                 'Common proverb; encourages persistence.',                           ['education'], 'A2'),
  s('I am learning English because I want to study abroad.','Tôi đang học tiếng Anh vì tôi muốn đi du học.','Cause + effect with "because".',                              ['education'], 'A2'),

  // ═══════════════════════════════════════════════════════════════════════════
  // TRAVEL  (~25)
  // ═══════════════════════════════════════════════════════════════════════════
  s('Where is the nearest hotel?',               'Khách sạn gần nhất ở đâu?',                        'Question using "where" with superlative.',                          ['travel'], 'A1'),
  s('How much does a ticket to Paris cost?',     'Vé đến Paris giá bao nhiêu?',                      'Standard price question.',                                          ['travel'], 'A1'),
  s('Can I see your passport, please?',          'Cho tôi xem hộ chiếu của bạn được không?',         'Polite request.',                                                   ['travel'], 'A1'),
  s('I love traveling around the world.',        'Tôi thích đi du lịch khắp thế giới.',              'Gerund after "love".',                                              ['travel'], 'A1'),
  s('Have a safe trip!',                         'Chúc bạn chuyến đi an toàn!',                      'Common farewell to travelers.',                                     ['travel'], 'A1'),
  s('The flight was delayed by two hours.',      'Chuyến bay bị trễ hai tiếng.',                     'Passive voice: "was delayed by".',                                  ['travel'], 'A2'),
  s('I always pack light when I travel abroad.', 'Tôi luôn đóng gói gọn nhẹ khi đi du lịch nước ngoài.','"Pack light" = mang ít đồ.',                                     ['travel'], 'A2'),
  s('We checked into the hotel and dropped off our bags.','Chúng tôi nhận phòng khách sạn và để hành lý xuống.','"Check into" + "drop off".',                              ['travel'], 'A2'),
  s('Excuse me, where can I exchange foreign currency?','Xin lỗi, tôi có thể đổi ngoại tệ ở đâu?','"Exchange foreign currency" = đổi ngoại tệ.',                          ['travel'], 'A2'),
  s('The hostel offers free Wi-Fi and a shared kitchen.','Nhà trọ có Wi-Fi miễn phí và bếp dùng chung.','"Offer" = cung cấp.',                                            ['travel'], 'A2'),
  s('We arrived at the airport three hours before our departure.','Chúng tôi đến sân bay ba tiếng trước giờ khởi hành.','"Before + noun" expresses time relation.',     ['travel'], 'A2'),
  s('Could you recommend a good local restaurant?','Bạn có thể giới thiệu một nhà hàng địa phương ngon không?','"Could you ...?" is more polite.',                          ['travel'], 'B1'),
  s('I lost my wallet somewhere on the train.',  'Tôi đã mất ví ở đâu đó trên tàu.',                 '"Somewhere" = chỗ nào đó.',                                         ['travel'], 'B1'),
  s('We should book the accommodation in advance.','Chúng ta nên đặt chỗ ở trước.',                    '"In advance" = trước (về thời gian).',                              ['travel'], 'B1'),
  s('Traveling solo has taught me a great deal about self-reliance.','Đi du lịch một mình đã dạy tôi rất nhiều về tính tự lập.','Gerund as subject.',                  ['travel'], 'B2'),
  s('The customs officer asked me to open my luggage for inspection.','Nhân viên hải quan yêu cầu tôi mở hành lý để kiểm tra.','"Ask someone to do".',                  ['travel'], 'B2'),
  s('By the time we arrived, the museum had already closed.','Khi chúng tôi đến nơi, bảo tàng đã đóng cửa rồi.','Past perfect.',                                          ['travel'], 'B2'),
  s('My passport expires next month.',           'Hộ chiếu của tôi hết hạn tháng sau.',              'Simple present for future scheduled events.',                       ['travel'], 'B1'),
  s('Do you have any travel insurance?',         'Bạn có bảo hiểm du lịch không?',                   '"Any" in question.',                                                ['travel'], 'B1'),
  s('The view from the mountain is breathtaking.','Quang cảnh từ trên núi thật ngoạn mục.',          '"Breathtaking" = ngoạn mục.',                                       ['travel'], 'B1'),
  s('I would like to book a window seat.',       'Tôi muốn đặt một ghế cửa sổ.',                     '"Would like to" + "window seat".',                                  ['travel'], 'A2'),
  s('Please fasten your seatbelt during the flight.','Vui lòng cài dây an toàn trong suốt chuyến bay.','Imperative; safety instruction.',                                 ['travel'], 'A2'),
  s('Hanoi is the capital of Vietnam.',          'Hà Nội là thủ đô của Việt Nam.',                   'Identity statement.',                                               ['travel'], 'A1'),
  s('Have you ever been to Japan?',              'Bạn đã từng đến Nhật Bản chưa?',                   'Present perfect with "ever".',                                      ['travel'], 'B1'),
  s('Let us take a photo in front of the temple.','Chúng ta hãy chụp một bức ảnh trước ngôi đền nhé.','"Let us + verb" suggestion.',                                     ['travel'], 'A2'),

  // ═══════════════════════════════════════════════════════════════════════════
  // WORK  (~20)
  // ═══════════════════════════════════════════════════════════════════════════
  s('I go to work by motorbike.',                'Tôi đi làm bằng xe máy.',                          '"Go to work by + transport".',                                      ['work'], 'A2'),
  s('My office starts work at eight in the morning.','Văn phòng tôi bắt đầu làm việc lúc tám giờ sáng.','Simple present for schedules.',                                  ['work'], 'A2'),
  s('We have a team meeting every Monday.',      'Chúng tôi họp nhóm vào mỗi thứ Hai.',              'Simple present + frequency.',                                       ['work'], 'A2'),
  s('She applied for a promotion last month.',   'Cô ấy đã nộp đơn xin thăng chức tháng trước.',     '"Apply for"; past simple.',                                         ['work'], 'B1'),
  s('The deadline for this project is next Friday.','Hạn chót của dự án này là thứ Sáu tuần tới.',   '"Deadline" universally used.',                                      ['work'], 'B1'),
  s('He is working overtime to finish the report on time.','Anh ấy đang làm thêm giờ để hoàn thành báo cáo đúng hạn.','"Work overtime" = làm thêm giờ.',                 ['work'], 'B1'),
  s('Could you email me the project proposal by end of day?','Bạn có thể gửi email cho tôi bản đề xuất dự án trước khi hết giờ làm không?','"By end of day" (EOD).',  ['work'], 'B1'),
  s('I submitted my resignation letter last Friday.','Tôi đã nộp đơn từ chức thứ Sáu tuần trước.','"Submit a resignation letter".',                                         ['work'], 'B1'),
  s('Please let me know if you need any further assistance.','Vui lòng cho tôi biết nếu bạn cần thêm trợ giúp.','Polite offer; business email register.',                  ['work'], 'B1'),
  s('The company has decided to expand into Southeast Asian markets.','Công ty đã quyết định mở rộng sang thị trường Đông Nam Á.','Present perfect; "expand into".',     ['work'], 'B2'),
  s('Effective communication is the cornerstone of good teamwork.','Giao tiếp hiệu quả là nền tảng của làm việc nhóm tốt.','"Cornerstone" = nền tảng.',                ['work'], 'B2'),
  s('She was promoted to senior manager after five years.','Cô ấy được thăng chức lên quản lý cấp cao sau năm năm.','Passive voice: "was promoted to".',                  ['work'], 'B2'),
  s('Remote work has blurred the boundaries between personal and professional life.','Làm việc từ xa đã làm mờ ranh giới giữa cuộc sống cá nhân và nghề nghiệp.','Present perfect.',['work'], 'B2'),
  s('I have a meeting with a client at noon.',   'Tôi có cuộc họp với khách hàng vào trưa nay.',     'Present arrangement.',                                              ['work'], 'A2'),
  s('Please send me the report by email.',       'Vui lòng gửi báo cáo cho tôi qua email.',          'Polite request with "by + means".',                                 ['work'], 'A2'),
  s('Our company hires new employees every year.','Công ty chúng tôi tuyển nhân viên mới mỗi năm.',   'Simple present habit.',                                             ['work'], 'A2'),
  s('I am looking for a new job opportunity.',   'Tôi đang tìm cơ hội việc làm mới.',                'Present continuous; "look for".',                                   ['work'], 'B1'),
  s('Working from home requires a lot of self-discipline.','Làm việc từ xa đòi hỏi rất nhiều kỷ luật bản thân.','Gerund as subject.',                                    ['work'], 'B1'),
  s('She has been with the company for ten years.','Cô ấy đã gắn bó với công ty được mười năm.',     'Present perfect; "for + duration".',                                ['work'], 'B1'),
  s('My boss is very supportive and understanding.','Sếp tôi rất hỗ trợ và thấu hiểu.',              'Two adjectives describing character.',                              ['work'], 'A2'),

  // ═══════════════════════════════════════════════════════════════════════════
  // WEATHER  (~20)
  // ═══════════════════════════════════════════════════════════════════════════
  s('It is sunny and warm today.',               'Hôm nay trời nắng và ấm áp.',                      '"It is + adjective" weather structure.',                            ['weather'], 'A1'),
  s('It is raining outside. Take an umbrella.',  'Trời đang mưa bên ngoài. Mang ô theo nhé.',        'Present continuous for current weather.',                           ['weather'], 'A1'),
  s('It is cloudy and a bit chilly today.',      'Hôm nay trời có mây và hơi lạnh.',                 '"A bit" softens the adjective.',                                    ['weather'], 'A1'),
  s('Make sure you wear a coat; it feels freezing outside.','Nhớ mặc áo khoác; bên ngoài lạnh buốt lắm.','Imperative + explanation.',                                      ['weather'], 'A2'),
  s('What is the weather like in Hanoi in December?','Thời tiết ở Hà Nội tháng Mười Hai thế nào?',   '"What is the weather like?" pattern.',                              ['weather'], 'A2'),
  s('The temperature dropped to five degrees Celsius last night.','Nhiệt độ đã giảm xuống năm độ C tối qua.','"Drop to" = giảm xuống.',                                   ['weather'], 'A2'),
  s('There is a storm forecast for this weekend.','Có dự báo bão vào cuối tuần này.',                '"There is ... forecast".',                                          ['weather'], 'B1'),
  s('The fog was so thick that we could not see the road.','Sương mù dày đặc đến mức chúng tôi không thấy được đường.','"So ... that" result clause.',                  ['weather'], 'B1'),
  s('Climate change is causing more severe weather events.','Biến đổi khí hậu đang gây ra nhiều hiện tượng thời tiết cực đoan hơn.','Present continuous; academic.',     ['weather'], 'B2'),
  s('We had to cancel the outdoor event due to heavy rain.','Chúng tôi phải huỷ sự kiện ngoài trời do mưa to.','"Due to" = vì.',                                          ['weather'], 'B1'),
  s('If it snows tonight, schools will be closed tomorrow.','Nếu tối nay có tuyết, các trường học sẽ đóng cửa ngày mai.','First conditional.',                          ['weather'], 'B1'),
  s('Extreme heatwaves have become more common in recent years.','Các đợt nắng nóng cực đoan đã trở nên phổ biến hơn.','Present perfect.',                              ['weather'], 'B2'),
  s('The rainy season usually lasts from May to October in southern Vietnam.','Mùa mưa thường kéo dài từ tháng Năm đến tháng Mười ở miền Nam Việt Nam.','"Last from ... to".',['weather'], 'B1'),
  s('Despite the bad weather, the outdoor concert went ahead as planned.','Bất chấp thời tiết xấu, buổi hòa nhạc ngoài trời vẫn diễn ra như kế hoạch.','"Despite" + noun.',['weather'], 'B2'),
  s('The sky is full of stars tonight.',         'Bầu trời đêm nay đầy sao.',                        '"Full of" = đầy.',                                                  ['weather'], 'A2'),
  s('There is a beautiful rainbow after the rain.','Có một cầu vồng đẹp sau cơn mưa.',                'Sentence structure with "after + noun".',                          ['weather'], 'A2'),
  s('Spring is my favorite season.',             'Mùa xuân là mùa yêu thích của tôi.',               'Simple present statement.',                                         ['weather'], 'A1'),
  s('It is hot in summer and cold in winter.',   'Trời nóng vào mùa hè và lạnh vào mùa đông.',       'Two contrasting clauses.',                                          ['weather'], 'A1'),
  s('Please bring a jacket; it might rain later.','Vui lòng mang áo khoác; có thể trời sẽ mưa sau đó.','"Might" expresses possibility.',                                 ['weather'], 'A2'),
  s('Today is a beautiful sunny day.',           'Hôm nay là một ngày nắng đẹp.',                    'Simple identity sentence.',                                         ['weather'], 'A1'),

  // ═══════════════════════════════════════════════════════════════════════════
  // ANIMALS  (~15, kid-friendly)
  // ═══════════════════════════════════════════════════════════════════════════
  s('I have a cat and a dog at home.',           'Tôi có một con mèo và một con chó ở nhà.',         '"Have" for possession.',                                            ['animals'], 'A1'),
  s('The lion is the king of the jungle.',       'Sư tử là chúa tể rừng xanh.',                      'Identity statement; common phrase.',                                ['animals'], 'A1'),
  s('Cows give us milk.',                        'Bò cho chúng ta sữa.',                             '"Give" + double object.',                                           ['animals'], 'A1'),
  s('Birds can fly in the sky.',                 'Chim có thể bay trên bầu trời.',                   '"Can" for ability.',                                                ['animals'], 'A1'),
  s('Fish live in water.',                       'Cá sống dưới nước.',                               'Simple present statement.',                                         ['animals'], 'A1'),
  s('Elephants are the largest land animals.',   'Voi là loài động vật trên cạn lớn nhất.',          'Superlative form.',                                                 ['animals'], 'A2'),
  s('My puppy loves to play with a ball.',       'Cún con của tôi thích chơi với quả bóng.',         '"Love to + verb".',                                                ['animals'], 'A1'),
  s('Cats are very independent animals.',        'Mèo là loài vật rất độc lập.',                     'Adjective placement.',                                              ['animals'], 'A2'),
  s('Bees make honey from flowers.',             'Ong làm mật từ hoa.',                              'Simple present; "from + source".',                                  ['animals'], 'A2'),
  s('Penguins live in cold places like Antarctica.','Chim cánh cụt sống ở những nơi lạnh như Nam Cực.','"Like" used for examples.',                                       ['animals'], 'A2'),
  s('Tigers are an endangered species.',         'Hổ là một loài đang bị đe dọa tuyệt chủng.',       '"Endangered species" = loài nguy cấp.',                             ['animals'], 'B1'),
  s('Many wild animals are losing their habitats.','Nhiều động vật hoang dã đang mất nơi sống.',     'Present continuous; environmental issue.',                          ['animals'], 'B1'),
  s('Look! That butterfly has beautiful wings.', 'Nhìn kìa! Con bướm đó có đôi cánh đẹp.',           'Imperative + observation.',                                         ['animals'], 'A1'),
  s('Dolphins are very intelligent creatures.',  'Cá heo là những sinh vật rất thông minh.',         '"Intelligent" describes character.',                                ['animals'], 'B1'),
  s('My favorite animal is the panda.',          'Loài vật yêu thích của tôi là gấu trúc.',          'Identity statement.',                                               ['animals'], 'A1'),

  // ═══════════════════════════════════════════════════════════════════════════
  // COLORS / NUMBERS  (~15, kid-friendly)
  // ═══════════════════════════════════════════════════════════════════════════
  s('What color is the sky?',                    'Bầu trời màu gì?',                                 '"What color is + noun?" pattern.',                                  ['colors'], 'A1'),
  s('The sky is blue.',                          'Bầu trời màu xanh.',                               'Linking verb + color.',                                             ['colors'], 'A1'),
  s('My favorite color is red.',                 'Màu yêu thích của tôi là màu đỏ.',                 'Identity statement.',                                               ['colors'], 'A1'),
  s('Roses are red, violets are blue.',          'Hoa hồng màu đỏ, hoa violet màu xanh.',            'Classic English poem opening.',                                     ['colors'], 'A1'),
  s('The traffic light turned green.',           'Đèn giao thông chuyển sang màu xanh.',             'Past simple; "turn + color".',                                      ['colors'], 'A2'),
  s('She wore a beautiful pink dress.',          'Cô ấy mặc một chiếc váy hồng đẹp.',                'Past simple; adjective order.',                                     ['colors'], 'A1'),
  s('How many apples do you have?',              'Bạn có bao nhiêu quả táo?',                        '"How many + countable noun".',                                      ['numbers'], 'A1'),
  s('I have five apples and three oranges.',     'Tôi có năm quả táo và ba quả cam.',                'Counting + plurals.',                                               ['numbers'], 'A1'),
  s('There are seven days in a week.',           'Có bảy ngày trong một tuần.',                      '"There are + plural".',                                             ['numbers'], 'A1'),
  s('Two plus two equals four.',                 'Hai cộng hai bằng bốn.',                           'Math sentence in English.',                                         ['numbers'], 'A1'),
  s('I will be ten years old next month.',       'Tháng sau tôi sẽ tròn mười tuổi.',                 'Future "will be" + age.',                                           ['numbers'], 'A1'),
  s('We have twenty students in our class.',     'Chúng tôi có hai mươi học sinh trong lớp.',        'Simple statement.',                                                 ['numbers'], 'A1'),
  s('The first student in the line is Tom.',     'Người đầu tiên trong hàng là Tom.',                'Ordinal number "first".',                                           ['numbers'], 'A1'),
  s('I came in third place at the race.',        'Tôi về thứ ba trong cuộc đua.',                    '"Come in + ordinal place".',                                        ['numbers'], 'A2'),
  s('Half of the pizza is mine.',                'Một nửa cái pizza là của tôi.',                    'Fraction "half"; possessive pronoun.',                              ['numbers'], 'A2'),

  // ═══════════════════════════════════════════════════════════════════════════
  // EMOTIONS  (~15)
  // ═══════════════════════════════════════════════════════════════════════════
  s('I am very happy today.',                    'Hôm nay tôi rất vui.',                             'Linking verb + adjective.',                                         ['emotions'], 'A1'),
  s('She looks sad. What is wrong?',             'Cô ấy trông buồn. Có chuyện gì vậy?',              '"Look" linking verb + observation.',                                ['emotions'], 'A1'),
  s('Are you afraid of the dark?',               'Bạn có sợ bóng tối không?',                        '"Be afraid of + noun".',                                            ['emotions'], 'A1'),
  s('I am excited about my birthday party.',     'Tôi rất hào hứng về tiệc sinh nhật của mình.',     '"Be excited about + noun".',                                        ['emotions'], 'A1'),
  s('Don\'t be angry with me.',                  'Đừng giận tôi.',                                   'Negative imperative; "be angry with".',                              ['emotions'], 'A2'),
  s('I feel tired after a long day at work.',    'Tôi cảm thấy mệt sau một ngày dài làm việc.',      '"Feel + adjective".',                                               ['emotions'], 'A2'),
  s('Children get bored very quickly.',          'Trẻ em nhanh chán lắm.',                           '"Get + adjective" for change of state.',                            ['emotions'], 'A2'),
  s('I am sorry to hear about your loss.',       'Tôi rất tiếc khi nghe tin buồn của bạn.',          'Expression of sympathy.',                                           ['emotions'], 'B1'),
  s('She felt nervous before the interview.',    'Cô ấy cảm thấy hồi hộp trước cuộc phỏng vấn.',     '"Felt nervous before + noun".',                                     ['emotions'], 'B1'),
  s('I am grateful for everything you have done.','Tôi biết ơn vì mọi điều bạn đã làm.',             '"Grateful for + noun".',                                            ['emotions'], 'B1'),
  s('He is proud of his achievements.',          'Anh ấy tự hào về thành tựu của mình.',             '"Proud of + noun".',                                                ['emotions'], 'B1'),
  s('Don\'t worry. Everything will be fine.',    'Đừng lo. Mọi chuyện sẽ ổn.',                       'Reassurance; future "will be".',                                    ['emotions'], 'A1'),
  s('I love spending time with my friends.',     'Tôi thích dành thời gian với bạn bè.',             '"Love + gerund".',                                                  ['emotions'], 'A1'),
  s('She felt embarrassed when she fell down.',  'Cô ấy cảm thấy xấu hổ khi ngã.',                   '"Felt embarrassed when + clause".',                                 ['emotions'], 'B1'),
  s('I miss my family when I am away.',          'Tôi nhớ gia đình mỗi khi đi xa.',                  '"Miss + object"; time clause.',                                     ['emotions'], 'A2'),

  // ═══════════════════════════════════════════════════════════════════════════
  // SHOPPING  (~15)
  // ═══════════════════════════════════════════════════════════════════════════
  s('How much does this cost?',                  'Cái này giá bao nhiêu?',                           'Standard price question.',                                          ['shopping'], 'A1'),
  s('Where is the checkout counter?',            'Quầy thanh toán ở đâu?',                           'Question with "where".',                                            ['shopping'], 'A2'),
  s('I would like to pay by credit card.',       'Tôi muốn thanh toán bằng thẻ tín dụng.',           '"Pay by + method".',                                                ['shopping'], 'A2'),
  s('Do you have this in a smaller size?',       'Bạn có cái này cỡ nhỏ hơn không?',                 'Comparative; shopping for clothes.',                                ['shopping'], 'A2'),
  s('Can I try it on?',                          'Tôi có thể thử được không?',                       '"Try on" for clothes.',                                             ['shopping'], 'A2'),
  s('It is too expensive for me.',               'Nó quá đắt đối với tôi.',                          '"Too + adjective + for + noun".',                                   ['shopping'], 'A1'),
  s('Is there a discount on this item?',         'Có giảm giá cho mặt hàng này không?',              '"Discount on + noun".',                                             ['shopping'], 'A2'),
  s('I am just looking, thank you.',             'Tôi chỉ xem thôi, cảm ơn.',                        'Polite refusal of help.',                                           ['shopping'], 'A2'),
  s('Where can I find the dairy section?',       'Tôi có thể tìm khu sản phẩm sữa ở đâu?',            'Question with "where can I find".',                                 ['shopping'], 'B1'),
  s('I forgot my shopping list at home.',        'Tôi để quên danh sách mua sắm ở nhà.',             'Past simple; "forget + noun".',                                     ['shopping'], 'A2'),
  s('Please give me a receipt.',                 'Xin cho tôi hóa đơn.',                             'Polite imperative.',                                                ['shopping'], 'A2'),
  s('This shirt comes in three colors.',         'Áo sơ mi này có ba màu.',                          '"Come in + colors/sizes".',                                         ['shopping'], 'B1'),
  s('I bought these shoes on sale.',             'Tôi đã mua đôi giày này khi giảm giá.',            '"On sale" = đang giảm giá.',                                        ['shopping'], 'A2'),
  s('The store opens at nine in the morning.',   'Cửa hàng mở cửa lúc chín giờ sáng.',               'Schedule in simple present.',                                       ['shopping'], 'A1'),
  s('Online shopping has become very popular.',  'Mua sắm trực tuyến đã trở nên rất phổ biến.',      'Present perfect; "become + adjective".',                            ['shopping'], 'B1'),

  // ═══════════════════════════════════════════════════════════════════════════
  // BODY / HEALTH  (~15)
  // ═══════════════════════════════════════════════════════════════════════════
  s('My head hurts.',                            'Tôi bị đau đầu.',                                  '"Hurt" as verb.',                                                   ['body', 'health'], 'A1'),
  s('I have a sore throat.',                     'Tôi bị đau họng.',                                 '"Have + symptom".',                                                 ['health'], 'A1'),
  s('Please open your mouth and say "ah".',      'Vui lòng há miệng và nói "a".',                    'Doctor instruction.',                                               ['health'], 'A2'),
  s('I need to see a doctor.',                   'Tôi cần đi khám bác sĩ.',                          '"Need to + verb".',                                                 ['health'], 'A1'),
  s('Take this medicine three times a day.',     'Uống thuốc này ba lần một ngày.',                  'Imperative; medical instruction.',                                  ['health'], 'A2'),
  s('Wash your hands before eating.',            'Rửa tay trước khi ăn.',                            'Imperative; hygiene tip.',                                          ['health'], 'A1'),
  s('My eyes are blue and my hair is black.',    'Mắt tôi màu xanh và tóc tôi màu đen.',             'Self-description.',                                                 ['body'], 'A1'),
  s('Touch your nose with your finger.',         'Chạm vào mũi bằng ngón tay.',                      'Imperative; physical instruction.',                                 ['body'], 'A1'),
  s('Regular exercise keeps you healthy.',       'Tập thể dục đều đặn giúp bạn khỏe mạnh.',          '"Keep + object + adjective".',                                      ['health'], 'A2'),
  s('Eat plenty of fruits and vegetables every day.','Hãy ăn nhiều trái cây và rau xanh mỗi ngày.', 'Imperative; "plenty of".',                                          ['health'], 'A2'),
  s('Sleep at least eight hours every night.',   'Ngủ ít nhất tám tiếng mỗi đêm.',                   '"At least" = ít nhất.',                                             ['health'], 'A2'),
  s('I have a stomachache from eating too much.','Tôi bị đau bụng vì ăn quá nhiều.',                 '"Stomachache" compound; "from + gerund".',                          ['health'], 'A2'),
  s('Drink plenty of water every day.',          'Uống nhiều nước mỗi ngày.',                        '"Plenty of + noun".',                                               ['health'], 'A1'),
  s('Do not stay up too late.',                  'Đừng thức quá khuya.',                             '"Stay up" = thức khuya.',                                           ['health'], 'A2'),
  s('Brush your teeth twice a day.',             'Đánh răng hai lần một ngày.',                      'Imperative + frequency.',                                           ['health'], 'A1'),

  // ═══════════════════════════════════════════════════════════════════════════
  // HOBBIES  (~10)
  // ═══════════════════════════════════════════════════════════════════════════
  s('What do you do in your free time?',         'Bạn làm gì lúc rảnh rỗi?',                         '"In your free time" question.',                                     ['hobbies'], 'A2'),
  s('My hobby is reading books.',                'Sở thích của tôi là đọc sách.',                    '"My hobby is + gerund".',                                           ['hobbies'], 'A1'),
  s('I love playing the guitar.',                'Tôi thích chơi đàn ghi-ta.',                       '"Play + the + instrument".',                                        ['hobbies'], 'A2'),
  s('She enjoys painting landscapes.',           'Cô ấy thích vẽ phong cảnh.',                       '"Enjoy + gerund".',                                                 ['hobbies'], 'B1'),
  s('Do you like watching movies?',              'Bạn có thích xem phim không?',                     '"Like + gerund".',                                                  ['hobbies'], 'A1'),
  s('We go hiking every Sunday.',                'Chúng tôi đi bộ đường dài mỗi Chủ Nhật.',          '"Go + gerund" for activities.',                                     ['hobbies'], 'A2'),
  s('I have been collecting stamps since I was a child.','Tôi đã sưu tầm tem từ khi còn nhỏ.',     'Present perfect continuous.',                                       ['hobbies'], 'B1'),
  s('She is interested in photography.',         'Cô ấy quan tâm đến nhiếp ảnh.',                    '"Be interested in + noun".',                                        ['hobbies'], 'B1'),
  s('Cooking is my favorite pastime.',           'Nấu ăn là thú vui yêu thích của tôi.',             '"Pastime" = thú vui.',                                              ['hobbies'], 'B1'),
  s('Playing video games is fun.',               'Chơi điện tử thật vui.',                           'Gerund as subject.',                                                ['hobbies'], 'A2'),

  // ═══════════════════════════════════════════════════════════════════════════
  // CLOTHES  (~12)
  // ═══════════════════════════════════════════════════════════════════════════
  s('What are you wearing today?',                 'Hôm nay bạn mặc gì vậy?',                          '"Wear" in present continuous.',                                     ['clothes'], 'A1'),
  s('I am wearing a blue T-shirt and jeans.',      'Tôi đang mặc áo phông xanh và quần jeans.',         'Present continuous; clothing items.',                               ['clothes'], 'A1'),
  s('She bought a new dress for the party.',       'Cô ấy đã mua một chiếc váy mới cho bữa tiệc.',      'Past simple; "dress for + noun".',                                  ['clothes'], 'A1'),
  s('These shoes are too tight.',                  'Đôi giày này quá chật.',                            '"Too + adjective" for complaints about fit.',                       ['clothes'], 'A1'),
  s('Please hang your coat on the hook.',          'Vui lòng treo áo khoác lên móc.',                   'Imperative; "hang on".',                                            ['clothes'], 'A2'),
  s('I need to iron my shirt before the interview.','Tôi cần ủi áo sơ mi trước buổi phỏng vấn.',       '"Need to" + obligation.',                                           ['clothes'], 'A2'),
  s('Do you prefer wearing casual or formal clothes?','Bạn thích mặc quần áo thường hay trang phục lịch sự?','Comparison: casual vs formal.',                                ['clothes'], 'A2'),
  s('This jacket does not match my trousers.',     'Cái áo khoác này không hợp với quần tây của tôi.',  '"Match" = đồng bộ, hợp.',                                          ['clothes'], 'A2'),
  s('She always dresses neatly for work.',         'Cô ấy luôn ăn mặc gọn gàng đi làm.',               '"Dress neatly" = ăn mặc gọn gàng.',                                ['clothes'], 'B1'),
  s('The fabric of this coat is very soft.',       'Vải của chiếc áo khoác này rất mềm.',               '"Fabric" = vải; "soft" = mềm.',                                    ['clothes'], 'B1'),
  s('Wearing a helmet is compulsory when riding a motorbike.','Đội mũ bảo hiểm là bắt buộc khi đi xe máy.','Gerund as subject; "compulsory".',                              ['clothes'], 'B1'),
  s('I left my umbrella on the bus.',              'Tôi đã để quên ô trên xe buýt.',                    '"Leave + object + location" = bỏ quên.',                           ['clothes'], 'A2'),

  // ═══════════════════════════════════════════════════════════════════════════
  // TECHNOLOGY  (~12)
  // ═══════════════════════════════════════════════════════════════════════════
  s('Can you show me how to use this app?',        'Bạn có thể chỉ cho tôi cách dùng ứng dụng này không?','"Show someone how to".',                                         ['technology'], 'A2'),
  s('My phone battery is almost dead.',            'Pin điện thoại tôi gần hết rồi.',                   '"Almost dead" = sắp hết pin.',                                     ['technology'], 'A2'),
  s('Please turn off your phone during the meeting.','Vui lòng tắt điện thoại trong cuộc họp.',         'Polite imperative; "turn off".',                                    ['technology'], 'A2'),
  s('I need to charge my laptop.',                 'Tôi cần sạc máy tính xách tay.',                    '"Charge" = sạc điện.',                                             ['technology'], 'A1'),
  s('The internet connection is very slow today.', 'Kết nối internet hôm nay rất chậm.',                'Simple present; common complaint.',                                ['technology'], 'A2'),
  s('She uploads photos to social media every day.','Cô ấy tải ảnh lên mạng xã hội mỗi ngày.',          '"Upload to" = tải lên.',                                           ['technology'], 'A2'),
  s('Technology has changed the way we communicate.','Công nghệ đã thay đổi cách chúng ta giao tiếp.',  'Present perfect; abstract statement.',                             ['technology'], 'B1'),
  s('I downloaded the latest version of the software.','Tôi đã tải xuống phiên bản mới nhất của phần mềm.','"Download" + "latest version".',                                ['technology'], 'B1'),
  s('Could you help me reset my password?',        'Bạn có thể giúp tôi đặt lại mật khẩu không?',       '"Reset password" = đặt lại mật khẩu.',                            ['technology'], 'A2'),
  s('Artificial intelligence is transforming many industries.','Trí tuệ nhân tạo đang biến đổi nhiều ngành công nghiệp.','Present continuous; academic.',                    ['technology'], 'B2'),
  s('I use social media to stay in touch with friends.','Tôi dùng mạng xã hội để giữ liên lạc với bạn bè.','"Stay in touch" = giữ liên lạc.',                              ['technology'], 'B1'),
  s('The new update fixed several bugs in the app.','Bản cập nhật mới đã sửa một số lỗi trong ứng dụng.','Past simple; "fix bugs".',                                        ['technology'], 'B1'),

  // ═══════════════════════════════════════════════════════════════════════════
  // NATURE  (~12)
  // ═══════════════════════════════════════════════════════════════════════════
  s('The forest is full of tall trees and wild animals.','Rừng đầy cây cao và thú hoang dã.',           '"Full of" + compound noun.',                                        ['nature'], 'A2'),
  s('The river flows from the mountains to the sea.','Con sông chảy từ núi ra biển.',                  '"Flow from ... to" direction.',                                     ['nature'], 'A2'),
  s('Let us go to the beach this weekend.',        'Chúng ta hãy đi biển cuối tuần này nhé.',           '"Let us + verb" suggestion.',                                       ['nature'], 'A1'),
  s('The sunset was absolutely beautiful last night.','Hoàng hôn tối qua thật đẹp tuyệt vời.',          '"Absolutely + adjective" intensifier.',                            ['nature'], 'A2'),
  s('We should protect the environment for future generations.','Chúng ta nên bảo vệ môi trường cho các thế hệ tương lai.','Modal "should" for obligation.',               ['nature'], 'B1'),
  s('Deforestation is a major cause of climate change.','Nạn phá rừng là nguyên nhân chính gây biến đổi khí hậu.','"Deforestation"; "major cause of".',                     ['nature'], 'B2'),
  s('Flowers bloom in spring.',                    'Hoa nở vào mùa xuân.',                             'Simple present; seasonal facts.',                                  ['nature'], 'A1'),
  s('There is a waterfall at the end of this trail.','Có một thác nước ở cuối con đường mòn này.',      '"There is + noun + location".',                                    ['nature'], 'A2'),
  s('Recycling helps reduce the amount of waste.',  'Tái chế giúp giảm lượng rác thải.',                'Gerund as subject.',                                                ['nature'], 'B1'),
  s('The ocean covers more than seventy percent of the Earth.','Đại dương bao phủ hơn bảy mươi phần trăm Trái Đất.','Percentage expression.',                              ['nature'], 'B1'),
  s('Earthquakes are common in Japan.',            'Động đất xảy ra thường xuyên ở Nhật Bản.',          'Simple present for general facts.',                                 ['nature'], 'A2'),
  s('She picked some wildflowers by the roadside.','Cô ấy hái một vài bông hoa dại bên đường.',         'Past simple; "pick flowers".',                                     ['nature'], 'A2'),

  // ═══════════════════════════════════════════════════════════════════════════
  // SPORTS  (~12)
  // ═══════════════════════════════════════════════════════════════════════════
  s('I play football with my friends on Saturdays.','Tôi chơi bóng đá với bạn bè vào thứ Bảy.',        '"Play + sport" (no article).',                                     ['sports'], 'A1'),
  s('She swims every day to stay fit.',            'Cô ấy bơi mỗi ngày để giữ dáng.',                  '"Swim" + purpose clause.',                                          ['sports'], 'A1'),
  s('Which sport is most popular in Vietnam?',     'Môn thể thao nào phổ biến nhất ở Việt Nam?',        'Superlative in question.',                                          ['sports'], 'A2'),
  s('He scored two goals in the final match.',     'Anh ấy đã ghi hai bàn thắng trong trận chung kết.','Past simple; "score a goal".',                                     ['sports'], 'A2'),
  s('Let us warm up before we start training.',    'Chúng ta hãy khởi động trước khi bắt đầu tập nhé.','"Warm up" phrasal verb.',                                           ['sports'], 'A2'),
  s('She has been training for the marathon for six months.','Cô ấy đã luyện tập cho cuộc thi marathon được sáu tháng.','Present perfect continuous.',                      ['sports'], 'B1'),
  s('The team played well but lost the game.',     'Đội bóng chơi tốt nhưng vẫn thua trận.',            'Past simple; concession with "but".',                              ['sports'], 'A2'),
  s('You need determination and discipline to become a professional athlete.','Bạn cần sự quyết tâm và kỷ luật để trở thành vận động viên chuyên nghiệp.','Abstract nouns; "to + verb" purpose.',['sports'], 'B2'),
  s('I pulled a muscle during the race.',          'Tôi đã bị giãn cơ trong lúc đua.',                 '"Pull a muscle" = bị giãn cơ.',                                    ['sports'], 'B1'),
  s('Basketball is my favorite sport.',            'Bóng rổ là môn thể thao yêu thích của tôi.',        'Identity statement.',                                               ['sports'], 'A1'),
  s('The referee blew his whistle to stop the game.','Trọng tài đã thổi còi để dừng trận đấu.',         '"Blow a whistle" + purpose.',                                      ['sports'], 'B1'),
  s('Going to the gym three times a week keeps me energized.','Đi gym ba lần một tuần giúp tôi tràn đầy năng lượng.','"Keep me + adjective".',                              ['sports'], 'B1'),

  // ═══════════════════════════════════════════════════════════════════════════
  // MUSIC  (~12)
  // ═══════════════════════════════════════════════════════════════════════════
  s('I listen to music every day.',                'Tôi nghe nhạc mỗi ngày.',                          '"Listen to music" collocation.',                                    ['music'], 'A1'),
  s('What kind of music do you like?',             'Bạn thích thể loại nhạc gì?',                      '"What kind of" question.',                                          ['music'], 'A1'),
  s('She plays the piano very well.',              'Cô ấy chơi đàn piano rất giỏi.',                   '"Play + the + instrument".',                                        ['music'], 'A1'),
  s('Turn up the volume, please.',                 'Vặn to âm lượng lên.',                             '"Turn up" phrasal verb.',                                           ['music'], 'A2'),
  s('He sings in a band at weekends.',             'Anh ấy hát trong một ban nhạc vào cuối tuần.',       '"Sing in a band".',                                                ['music'], 'A2'),
  s('This song reminds me of my childhood.',       'Bài hát này gợi cho tôi nhớ thời thơ ấu.',         '"Remind of" = gợi nhớ.',                                           ['music'], 'B1'),
  s('Learning to play an instrument requires patience.','Học chơi nhạc cụ đòi hỏi sự kiên nhẫn.',     'Gerund as subject.',                                                ['music'], 'B1'),
  s('She has been taking violin lessons since she was five.','Cô ấy học đàn violin từ khi năm tuổi.',  'Present perfect continuous.',                                       ['music'], 'B1'),
  s('The concert was sold out weeks in advance.',  'Buổi hòa nhạc đã bán hết vé nhiều tuần trước.',    'Passive; "sold out in advance".',                                   ['music'], 'B1'),
  s('Music has the power to change your mood.',    'Âm nhạc có sức mạnh thay đổi tâm trạng bạn.',      '"The power to + verb".',                                           ['music'], 'B2'),
  s('He composed his first song at the age of twelve.','Anh ấy sáng tác bài hát đầu tiên năm mười hai tuổi.','"Compose" = sáng tác.',                                     ['music'], 'B2'),
  s('I hum this tune whenever I am happy.',        'Tôi khe khẽ hát giai điệu này mỗi khi vui.',       '"Whenever" + present simple.',                                      ['music'], 'B1'),

  // ═══════════════════════════════════════════════════════════════════════════
  // CITY / PLACES  (~12)
  // ═══════════════════════════════════════════════════════════════════════════
  s('Where is the nearest bus stop?',              'Trạm xe buýt gần nhất ở đâu?',                     '"Nearest" superlative with "where".',                               ['city'], 'A1'),
  s('The park is next to the library.',            'Công viên ở ngay cạnh thư viện.',                  '"Next to" preposition of place.',                                   ['city'], 'A1'),
  s('Turn left at the traffic lights.',            'Rẽ trái ở đèn giao thông.',                        'Giving directions.',                                                ['city'], 'A1'),
  s('The city center is very busy on weekdays.',   'Trung tâm thành phố rất nhộn nhịp vào các ngày trong tuần.','Frequency expression.',                                  ['city'], 'A2'),
  s('There is a new shopping mall near our school.','Có một trung tâm thương mại mới gần trường chúng tôi.','"There is + noun + location".',                                 ['city'], 'A2'),
  s('The museum is open from Tuesday to Sunday.',  'Bảo tàng mở cửa từ thứ Ba đến Chủ Nhật.',          'Schedule with "from ... to".',                                      ['city'], 'A2'),
  s('Ho Chi Minh City is the largest city in Vietnam.','Thành phố Hồ Chí Minh là thành phố lớn nhất ở Việt Nam.','Superlative fact.',                                      ['city'], 'B1'),
  s('Excuse me, how far is it to the train station?','Xin lỗi, đến ga tàu bao xa?',                    '"How far is it to".',                                               ['city'], 'A2'),
  s('She got lost in the old quarter of the city.','Cô ấy bị lạc trong khu phố cổ của thành phố.',    '"Get lost" = bị lạc.',                                              ['city'], 'B1'),
  s('The city has excellent public transportation.','Thành phố có hệ thống giao thông công cộng xuất sắc.','Noun phrase; "excellent" = xuất sắc.',                          ['city'], 'B1'),
  s('They are building a new subway line across the city.','Họ đang xây dựng một tuyến tàu điện ngầm mới khắp thành phố.','Present continuous for ongoing construction.',  ['city'], 'B1'),
  s('The old bridge has been a symbol of the city for centuries.','Cây cầu cổ đã là biểu tượng của thành phố qua nhiều thế kỷ.','Present perfect; "for centuries".',       ['city'], 'B2'),

  // ═══════════════════════════════════════════════════════════════════════════
  // HOUSE / HOME  (~12)
  // ═══════════════════════════════════════════════════════════════════════════
  s('Our house has three bedrooms and two bathrooms.','Nhà chúng tôi có ba phòng ngủ và hai phòng tắm.','"Have" for describing rooms.',                                      ['house'], 'A1'),
  s('Please take off your shoes before entering.',  'Vui lòng cởi giày trước khi vào.',                 'Imperative; polite request.',                                       ['house'], 'A1'),
  s('The kitchen is next to the dining room.',     'Nhà bếp ở cạnh phòng ăn.',                         '"Next to" preposition.',                                            ['house'], 'A1'),
  s('I share a flat with two other students.',     'Tôi ở chung căn hộ với hai sinh viên khác.',        '"Share a flat with".',                                              ['house'], 'A2'),
  s('Could you help me move this sofa?',           'Bạn có thể giúp tôi dịch chuyển sofa này không?',  'Polite request.',                                                   ['house'], 'A2'),
  s('The rent for this apartment is very affordable.','Tiền thuê căn hộ này rất phải chăng.',           '"Rent" + "affordable".',                                            ['house'], 'B1'),
  s('She is decorating her room with posters.',    'Cô ấy đang trang trí phòng bằng các tấm áp phích.','Present continuous; "decorate with".',                              ['house'], 'A2'),
  s('The roof needs to be repaired before the rainy season.','Mái nhà cần được sửa trước mùa mưa.',     'Passive infinitive: "needs to be repaired".',                      ['house'], 'B1'),
  s('There is a lovely garden behind our house.',  'Có một khu vườn đẹp ở phía sau nhà chúng tôi.',    '"Behind" preposition.',                                             ['house'], 'A2'),
  s('Living in the city is more convenient than in the countryside.','Sống ở thành phố tiện lợi hơn ở nông thôn.','Comparative.',                                          ['house'], 'B1'),
  s('She keeps her room clean and tidy.',          'Cô ấy giữ phòng sạch sẽ và gọn gàng.',             '"Keep + object + adjective".',                                     ['house'], 'A2'),
  s('We moved into our new house last month.',     'Chúng tôi đã dọn vào nhà mới tháng trước.',         '"Move into" = dọn vào.',                                           ['house'], 'A2'),

  // ═══════════════════════════════════════════════════════════════════════════
  // FURNITURE  (~8)
  // ═══════════════════════════════════════════════════════════════════════════
  s('There is a big wooden table in the kitchen.', 'Có một chiếc bàn gỗ lớn trong bếp.',               '"There is + noun + location".',                                    ['furniture'], 'A1'),
  s('Please sit on the chair, not on the floor.',  'Vui lòng ngồi trên ghế, không phải trên sàn.',     'Contrasting prepositions.',                                         ['furniture'], 'A1'),
  s('The bookshelf is full of interesting books.',  'Kệ sách đầy những cuốn sách thú vị.',              '"Full of" = đầy.',                                                 ['furniture'], 'A2'),
  s('She placed a vase of flowers on the window sill.','Cô ấy đặt một bình hoa trên bậu cửa sổ.',      '"Place on" = đặt lên.',                                            ['furniture'], 'A2'),
  s('The bedroom needs a new wardrobe.',           'Phòng ngủ cần một tủ quần áo mới.',                 '"Need + noun".',                                                   ['furniture'], 'A2'),
  s('Please hang the picture on the wall.',        'Vui lòng treo bức tranh lên tường.',                'Imperative; "hang on".',                                            ['furniture'], 'A1'),
  s('This sofa is very comfortable to sit on.',    'Chiếc sofa này rất thoải mái để ngồi.',             '"Comfortable to + verb".',                                         ['furniture'], 'A2'),
  s('She replaced the old curtains with new ones.','Cô ấy đã thay rèm cũ bằng rèm mới.',               '"Replace with" = thay bằng.',                                      ['furniture'], 'B1'),

  // ═══════════════════════════════════════════════════════════════════════════
  // TRANSPORTATION  (~12)
  // ═══════════════════════════════════════════════════════════════════════════
  s('How do you get to school?',                   'Bạn đến trường bằng cách nào?',                     '"How do you get to" question.',                                    ['transportation'], 'A1'),
  s('I take the bus to school every morning.',     'Tôi đi xe buýt đến trường mỗi sáng.',              '"Take the bus" collocation.',                                       ['transportation'], 'A1'),
  s('The train is faster than the bus.',           'Tàu hỏa nhanh hơn xe buýt.',                       'Comparative adjective.',                                            ['transportation'], 'A2'),
  s('We missed the last train home.',              'Chúng tôi đã lỡ chuyến tàu cuối về nhà.',           '"Miss the train" = lỡ tàu.',                                       ['transportation'], 'A2'),
  s('Is there a direct flight from Hanoi to Tokyo?','Có chuyến bay thẳng từ Hà Nội đến Tokyo không?',  '"Direct flight from ... to".',                                     ['transportation'], 'B1'),
  s('The taxi driver took a longer route.',        'Tài xế taxi đã đi đường vòng.',                    '"Take a route".',                                                  ['transportation'], 'B1'),
  s('Bicycles are eco-friendly and cheap to maintain.','Xe đạp thân thiện với môi trường và rẻ để bảo trì.','"Eco-friendly" = thân thiện môi trường.',                      ['transportation'], 'B1'),
  s('Please fasten your seatbelt.',                'Vui lòng thắt dây an toàn.',                        'Safety instruction; polite imperative.',                            ['transportation'], 'A1'),
  s('The highway was jammed during rush hour.',    'Đường cao tốc bị tắc trong giờ cao điểm.',          '"Traffic jam"; "rush hour".',                                      ['transportation'], 'B1'),
  s('You have to validate your ticket before boarding.','Bạn phải xác nhận vé trước khi lên tàu.',     '"Validate" = xác nhận vé.',                                        ['transportation'], 'B1'),
  s('She prefers cycling to driving in the city.',  'Cô ấy thích đi xe đạp hơn là lái xe trong thành phố.','Gerund comparison.',                                           ['transportation'], 'B1'),
  s('Public transport can reduce traffic congestion.','Giao thông công cộng có thể giảm tình trạng tắc nghẽn.','Modal; "reduce congestion".',                               ['transportation'], 'B2'),

  // ═══════════════════════════════════════════════════════════════════════════
  // TIME  (~12)
  // ═══════════════════════════════════════════════════════════════════════════
  s('What time does the show start?',              'Buổi biểu diễn bắt đầu lúc mấy giờ?',              '"What time does ... start?"',                                       ['time'], 'A1'),
  s('It is quarter past eight.',                   'Bây giờ là tám giờ mười lăm.',                     '"Quarter past" = 15 minutes past.',                                 ['time'], 'A1'),
  s('The meeting is at three o\'clock sharp.',     'Cuộc họp lúc đúng ba giờ.',                        '"At ... sharp" = đúng giờ.',                                       ['time'], 'A2'),
  s('I will call you back in five minutes.',       'Tôi sẽ gọi lại cho bạn trong năm phút.',            'Future "will" + time expression.',                                 ['time'], 'A2'),
  s('Time flies when you are having fun.',         'Thời gian trôi nhanh khi bạn đang vui.',            'Common idiom.',                                                     ['time'], 'B1'),
  s('She arrived ten minutes late for the appointment.','Cô ấy đến muộn mười phút so với lịch hẹn.',   '"Arrive late for" + appointment.',                                  ['time'], 'A2'),
  s('We have been waiting for over an hour.',      'Chúng tôi đã đợi hơn một tiếng rồi.',              'Present perfect continuous; "over an hour".',                       ['time'], 'B1'),
  s('I will be back before midnight.',             'Tôi sẽ về trước nửa đêm.',                         '"Before + time" future.',                                           ['time'], 'A2'),
  s('He spent three hours completing the assignment.','Anh ấy đã mất ba tiếng để hoàn thành bài tập.', '"Spend time + gerund".',                                           ['time'], 'B1'),
  s('By this time next year I will have graduated.','Vào thời điểm này năm sau tôi sẽ đã tốt nghiệp.',  'Future perfect tense.',                                             ['time'], 'B2'),
  s('She always finishes her tasks ahead of time.','Cô ấy luôn hoàn thành nhiệm vụ trước hạn.',         '"Ahead of time" = trước hạn.',                                     ['time'], 'B1'),
  s('Do not waste time on things that do not matter.','Đừng lãng phí thời gian vào những điều không quan trọng.','Negative imperative; advice.',                            ['time'], 'B1'),

  // ═══════════════════════════════════════════════════════════════════════════
  // SCHOOL  (~8, complements EDUCATION with school-specific vocab)
  // ═══════════════════════════════════════════════════════════════════════════
  s('The school bell rings at seven thirty.',      'Chuông trường reo lúc bảy giờ rưỡi.',              'Simple present for schedules.',                                     ['school', 'education'], 'A1'),
  s('My classroom is on the second floor.',        'Lớp học của tôi ở trên tầng hai.',                 '"On the + floor".',                                                 ['school'], 'A1'),
  s('We have six lessons every day.',              'Chúng tôi có sáu tiết học mỗi ngày.',              'Quantity + frequency.',                                             ['school'], 'A1'),
  s('The principal gave a speech at the assembly.','Hiệu trưởng đã phát biểu trong buổi chào cờ.',    '"Give a speech at".',                                               ['school'], 'A2'),
  s('Students must wear a uniform at this school.','Học sinh phải mặc đồng phục ở trường này.',        'Modal "must" for rules.',                                           ['school', 'education'], 'A2'),
  s('Our school has a big playground and a gym.',  'Trường chúng tôi có sân chơi rộng và phòng thể thao.','Listing with "and".',                                           ['school'], 'A2'),
  s('The school canteen serves lunch from eleven thirty to one.','"Căng-tin trường phục vụ bữa trưa từ mười một giờ rưỡi đến một giờ.','Schedule with "from ... to".',     ['school'], 'A2'),
  s('After school she goes to an English tutoring class.','Sau giờ học cô ấy đi học thêm tiếng Anh.', '"After school" time expression.',                                   ['school', 'education'], 'A2'),

  // ═══════════════════════════════════════════════════════════════════════════
  // MIXED / CONVERSATION
  // ═══════════════════════════════════════════════════════════════════════════
  s('Could you speak more slowly, please?',      'Bạn có thể nói chậm hơn được không?',              'Polite request.',                                                   ['greetings', 'education'], 'A1'),
  s('I do not understand. Could you explain?',   'Tôi không hiểu. Bạn có thể giải thích không?',      'Asking for clarification.',                                         ['education'], 'A2'),
  s('How do you spell that?',                    'Cái đó đánh vần thế nào?',                         'Asking about spelling.',                                            ['education'], 'A1'),
  s('Can you repeat that, please?',              'Bạn có thể nhắc lại không?',                       'Polite request.',                                                   ['greetings'], 'A1'),
  s('I think it is going to rain soon.',         'Tôi nghĩ trời sắp mưa rồi.',                       '"Going to" future + soon.',                                         ['weather'], 'A2'),
  s('What time is it?',                          'Bây giờ là mấy giờ?',                              'Time question.',                                                    ['time'], 'A1'),
  s('It is half past three.',                    'Bây giờ là ba giờ rưỡi.',                          'Time answer; BrE pattern.',                                         ['time'], 'A1'),
  s('His presentation was so well-prepared that he received a standing ovation.','Bài thuyết trình của anh ấy được chuẩn bị quá tốt đến mức nhận được tràng pháo tay.','"So ... that" + standing ovation.',['work', 'education'], 'B2'),
  s('I am learning English to get a better job.','Tôi đang học tiếng Anh để có công việc tốt hơn.',  '"To + verb" expresses purpose.',                                    ['education', 'work'], 'A2'),
  s('Let us go for a walk in the park.',         'Chúng ta hãy đi dạo trong công viên nhé.',         '"Let us + verb" suggestion.',                                       ['hobbies', 'daily_life'], 'A2'),
];

// ─── Per-topic kid-friendly YouTube videos ───────────────────────────────────
// Each entry is a YouTube search URL — opens in a new tab to a curated channel.
// Frontend can also embed the equivalent /embed/ URL of the resulting video.

const TOPIC_VIDEOS = {
  greetings:      'https://www.youtube.com/results?search_query=hello+song+for+kids+super+simple+songs',
  daily_life:     'https://www.youtube.com/results?search_query=daily+routines+english+for+kids',
  family:         'https://www.youtube.com/results?search_query=family+members+song+for+kids',
  food:           'https://www.youtube.com/results?search_query=food+song+for+kids+english',
  school:         'https://www.youtube.com/results?search_query=school+vocabulary+for+kids',
  education:      'https://www.youtube.com/results?search_query=school+vocabulary+for+kids',
  travel:         'https://www.youtube.com/results?search_query=travel+vocabulary+english+for+kids',
  work:           'https://www.youtube.com/results?search_query=jobs+and+occupations+english+for+kids',
  weather:        'https://www.youtube.com/results?search_query=weather+song+for+kids+super+simple',
  animals:        'https://www.youtube.com/results?search_query=animals+song+for+kids+english',
  colors:         'https://www.youtube.com/results?search_query=colors+song+for+kids+super+simple',
  numbers:        'https://www.youtube.com/results?search_query=numbers+song+for+kids+1+to+20',
  body:           'https://www.youtube.com/results?search_query=body+parts+song+for+kids',
  health:         'https://www.youtube.com/results?search_query=health+vocabulary+english+for+kids',
  emotions:       'https://www.youtube.com/results?search_query=feelings+and+emotions+song+for+kids',
  shopping:       'https://www.youtube.com/results?search_query=shopping+english+conversation+for+kids',
  hobbies:        'https://www.youtube.com/results?search_query=hobbies+vocabulary+english+for+kids',
  time:           'https://www.youtube.com/results?search_query=what+time+is+it+song+for+kids',
  clothes:        'https://www.youtube.com/results?search_query=clothes+song+for+kids+super+simple',
  technology:     'https://www.youtube.com/results?search_query=technology+vocabulary+english',
  nature:         'https://www.youtube.com/results?search_query=nature+vocabulary+english+for+kids',
  sports:         'https://www.youtube.com/results?search_query=sports+vocabulary+english+for+kids',
  music:          'https://www.youtube.com/results?search_query=music+instruments+vocabulary+for+kids',
  city:           'https://www.youtube.com/results?search_query=places+in+the+city+for+kids',
  house:          'https://www.youtube.com/results?search_query=rooms+in+the+house+song+for+kids',
  furniture:      'https://www.youtube.com/results?search_query=furniture+vocabulary+for+kids',
  transportation: 'https://www.youtube.com/results?search_query=transportation+song+for+kids',
};

module.exports = { SENTENCE_LIST, TOPIC_VIDEOS };
