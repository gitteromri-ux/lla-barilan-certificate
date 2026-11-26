/* Appendix only. Keep the nine meeting slides and executive narrative untouched. */
(()=>{
if(window.evidenceStart==null)return;
const slides=[...document.querySelectorAll('.s')];
// Preserve the original underlying workload, job-count and motivation exhibits as context.
for(let k=0;k<4;k++){const copy=slides[k].cloneNode(true);copy.dataset.originalExhibit=k;slides[23].parentNode.insertBefore(copy,document.querySelector('#p'))}
window.evidenceStart=Math.min(27,Math.max(0,(parseInt(new URLSearchParams(location.search).get('appendix'))||1)-1));
const src={
 Proposal:'https://github.com/gitteromri-ux/lla-barilan-certificate/blob/main/materials/proposal_barilan_health360.pdf',
 Primal:'https://www.primalhealthcoach.com/advanced-coaching-expert-certification/',Checkout:'https://nm356.infusionsoft.com/app/orderForms/a4d7d9a4-5254-4eea-9d73-f5917b102543',
 HG:'https://www.hg-institute.com/coach-certification','HG workload':'https://learn.hg-institute.com/faq',
 Harvard:'https://learn.hms.harvard.edu/programs/nutrition-and-wellness-coaching','Harvard Chan':'https://hsph.harvard.edu/ala/fundamentals-of-longevity-science/',
 UCI:'https://ssihi.uci.edu/education/continuing-integrative-health-education/aim-health-wellness-coaching-certificate-program/',IAP:'https://www.iapcollege.com/program/longevity-coach-master-professional-certification-course/',
 Mayo:'https://wellnesscoachtraining.mayo.edu/','Mayo 2027':'https://ce.mayo.edu/special-topics-in-health-care/content/health-and-wellness-coach-training-program-details','Mayo syllabus':'https://ce.mayo.edu/sites/default/files/media/2026-10/Student_Overview_Schedule_Jan%202027_FINAL_2.pdf',
 'UW outcomes':'https://careerbridge.wa.gov/learn/program/124',UW:'https://www.pce.uw.edu/certificates/gerontology',Biohackers:'https://academy.biohackers.world/',
 CLD:'https://longevitydocs.org/products/certified-longevity-docs%E2%84%A2','CLD curriculum':'https://longevitydocs.org/blogs/news/how-to-become-a-longevity-doctor',
 'NBHWC survey (pp. 5, 13)':'https://nbhwc.org/wp-content/uploads/2026/01/NBHWC-Annual-Survey-Report-2025.pdf',BLS:'https://www.bls.gov/news.release/ocwage.t01.htm',ACE:'https://www.acefitness.org/fitness-certifications/bundles/group-fitness-active-aging-coach/',Delgado:'https://www.dcc.edu/workforce-development/community-economic-development/health-coach/program-information.aspx',
 HCA:'https://www.healthcoachesacademy.com/12-week-coaching-certificate',UVM:'https://learn.uvm.edu/program/integrative-health-and-wellness-coaching-certificate/',HEA:'https://healthexpertsalliance.org/programs/longevity-certification',
 'Comparison guide':'https://www.lifecoachmagazine.com/longevity-coach-certification/',LinkedIn:'https://www.linkedin.com/help/lms/answer/a425662'
};
const link=(u,t)=>`<a target="_blank" rel="noopener" href="${u}">${t}</a>`;
const tab=(id,t)=>`<a class="btab" href="?appendix=${id}">${t}</a>`;
const tbl=(heads,rows,widths)=>`<table><colgroup>${widths.map(v=>`<col style="width:${v}%">`).join('')}</colgroup><thead><tr>${heads.map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map((v,i)=>`<${i?'td':'th'}>${v}</${i?'td':'th'}>`).join('')}</tr>`).join('')}</tbody></table>`;
const page=(id,cat,title,sub,table,foot,refs)=>{
 const s=slides[id-1];s.classList.add('bench');s.innerHTML=`<article class="benchsheet"><header><span>BAR-ILAN × LONGEVITY LIFE ACADEMY</span><span>U.S. BENCHMARK STUDY &nbsp; / &nbsp; ${cat}</span></header><h1>${title}</h1><p class="bs">${sub}</p><div class="bt">${table}</div><p class="bf">${foot}</p><footer><div><b>SOURCES</b> ${refs.map(k=>link(src[k],k)).join(' · ')}</div><nav>${tab(1,'Master')}${tab(2,'Economics')}${tab(3,'Demand')}${tab(4,'Buyers')}${tab(7,'Method')}</nav></footer></article>`;
};
page(1,'01 · MASTER CHART','Two cohorts match the workload. Neither is a direct longevity rival.',
'Screen: a U.S.-facing online group, assessed practice, a named certificate, published tuition, and approximately 80–150 total learner hours including independent work. These are format peers, not market-share leaders.',
tbl(['Same measure','Bar-Ilan × LLA · proposed','Primal · Advanced Coaching Expert','HG Institute · Coaching Elements Quest'],[
['Subject / buyer','Non-clinical longevity advice; working professionals','Applied coaching skills; existing or aspiring coaches','Mental health and digital wellness coaching; non-clinical'],
['Term / cohort','8 months; start conditional','12 weeks; Feb 15, 2027 listed','20 weeks; Jan 19, 2027 listed'],
['Total learning time','≈100 h: 45 live + ≈30 study + ≈25 practicum','96–120 h estimated: 12 × 8–10 h/week, including practice','100–140 h estimated: 20 × 5–7 h/week, including self-study'],
['Live teaching / count','30 × 90 min = 45 h; 24 subject sessions + 6 other','24 × 90 min = 36 h; twice weekly','≈3–5 live h/week; Tue/Thu. ≈40 meetings inferred, not a published lesson count'],
['Assessed work','Supervised case, portfolio and capstone','Graded coaching recording, practice and exams; no thesis specified','Three practical skills assessments, quizzes and assignments; no thesis specified'],
['Award','Proposed: Certified Longevity and Lifelong Wellbeing Advisor','Advanced Coaching Expert; not the Master Primal credential by itself','HG Institute Coaching Elements Certificate; not the NBC-HWC board title'],
['Tuition / actual plan','Not approved; no installments approved','$1,995 upfront or 3 × $704 = $2,112','$4,999 upfront or 5 monthly × $1,049 = $5,245'],
['Unit prices¹','Not calculable until tuition is approved','$720/month equivalent · $16.63–20.78/total h · $83.13/live class','$1,083/month equivalent · $35.71–49.99/total h · ≈$124.98/modeled meeting']
],[17,26,28,29]),
'¹ Normalized to course duration, not a financing quote. Neither provider publishes comparable U.S. paid enrollments for these specific courses. No comparable-based tuition recommendation follows.', ['Proposal','Primal','Checkout','HG','HG workload']);
page(2,'02 · UNIT ECONOMICS','Separate the bill buyers receive from tuition per hour of learning.',
'Upfront tuition is the numerator throughout. Hours include self-study, homework and practice where the school includes them. A live class is not the same unit as a syllabus module.',
tbl(['Price measure','Bar-Ilan × LLA','Primal · Advanced Coaching Expert','HG · Coaching Elements Quest'],[
['Upfront / actual financing','P = authorized fee; presently unknown','$1,995 cash vs $2,112 plan; $117 more. Provider lists three payments, not their cadence.','$4,999 cash vs $5,245 plan; $246 more. Five monthly bills of $1,049.'],
['Normalized per month','P ÷ 8','$720.42 (12 weeks ≈ 2.77 months)','$1,083.12 (20 weeks ≈ 4.62 months)'],
['Per week of course','8 calendar months; exact weeks not fixed','$166.25','$249.95'],
['Per total learner hour','P ÷ ≈100','$1,995 ÷ 120–96 h = $16.63–20.78','$4,999 ÷ 140–100 h = $35.71–49.99'],
['Per live meeting','P ÷ 30 (not P ÷ 24 subject lessons)','$1,995 ÷ 24 = $83.13','Published count unavailable. If 2/week for all 20 weeks: $4,999 ÷ 40 ≈ $124.98.'],
['Per live clock hour','P ÷ 45','$1,995 ÷ 36 = $55.42','≈$49.99–83.32 using 60–100 live hours from FAQ; upper/lower estimates, not billed rates.']
],[20,20,29,31]),
'Method: use 52 weeks ÷ 12 months. Round only after division. Prices are U.S.-facing listed dollars, not paid averages. Financing, class counts and learning-hour assumptions must travel with the figures.', ['Proposal','Primal','Checkout','HG','HG workload']);
page(3,'03 · DEMAND EVIDENCE','Mayo has evidence of uptake. No source establishes a U.S. market leader.',
'These are the strongest program-level signals located, not a ranking. Read each number with its geography, period and denominator. None is annual U.S. sales of comparable longevity cohorts.',
tbl(['Evidence strength','Observed signal','What it establishes','What it cannot establish'],[
['State outcomes record','University of Washington gerontology: 60 completers; 20/year average; 82% completion.','A public program-level outcomes record. Period dates are not stated on the listing.','Not paid enrollments; an asynchronous gerontology certificate is not a live cohort peer.'],
['Provider cumulative count','Mayo reports >1,500 wellness coaches trained since 2011.','Demonstrated historical uptake for a named coaching program.','Not annual sales; U.S.-only count and net tuition collected are not disclosed.'],
['Provider global claim','Biohackers World promotes 200+ graduates across 30+ countries.','A longevity-adjacent provider reports international participation.','Not a U.S. count, market share, or audited cohort-by-cohort sales.'],
['Capacity / availability','Primal caps a class at 72; HG publishes scheduled cohorts.','Capacity and an active offering.','Neither is the number of people who enrolled, paid or completed.'],
['Market share','No common U.S. numerator and denominator identified.','To calculate: program’s U.S. paid seats ÷ all comparable U.S. paid seats in the same period.','No defensible “top three,” percentage share or sales-weighted median.']
],[17,28,25,30]),
'Commercial implication: use Primal and HG for delivery economics; use Mayo and UW for evidence that adjacent training attracts learners. Do not combine these into a single score.', ['UW outcomes','UW','Mayo','Biohackers','Primal','HG']);
page(4,'04 · BUYER EVIDENCE','Fitness, coaching and education deserve their own audience tests.',
'In the 2025 NBHWC survey, 2,328 coaches responded overall. Among respondents reporting credentials outside coaching, fitness/movement was 29%, educators 12%, other licensed healthcare 9%, and nursing 8%. This is not the buyer mix of this certificate.',
tbl(['Test segment / payer','Evidence of fit, not buyer share','What they may want to buy','Question that qualifies a real prospect'],[
['Independent health / wellness coach · self-pay','41% of reported primary employment settings were private practice in the NBHWC survey.','A specialization they can apply to an existing client, with supervised case feedback.','“Which client decision would change? Which other certificate are you considering?”'],
['Fitness trainer / group instructor · self or gym','29% fitness/movement in the additional-credential item. BLS: 322,930 U.S. exercise trainer/group instructor jobs.','An aging specialty for clients or groups. Some specifically need an exercise qualification instead.','“Do you need to teach exercise classes, or run a non-clinical wellbeing program?”'],
['Educator / community lead · self or sponsor','12% educators in that item. BLS: 65,690 health education specialist jobs and 61,660 community health worker jobs.','A supervised group program they can deliver through a community organization.','“Which population, project and sponsor would use the capstone?”'],
['Clinical professional · self or employer','8% nursing and 9% other licensed healthcare in the same item. Not 90% nurses.','Complementary advisory skills within an existing license; some require clinical CE or board credit.','“Which credit or title must your employer accept? Is that a deal-breaker?”'],
['Workplace wellbeing lead · employer','10% of reported primary coaching settings were corporate wellness; the purchaser may not be the learner.','A staff development project, outcomes rubric and funding case.','“Who signs the budget, who takes the course, and when can they authorize it?”']
],[20,28,25,27]),
'BLS counts jobs, not buyers. The survey includes international respondents; the credential-item sample size is not reported. Do not turn these numbers into media allocations. Measure applications and paid seats by role, use case and payer.', ['NBHWC survey (pp. 5, 13)','BLS','ACE','Proposal']);
page(5,'05 · BRAND SUBSTITUTES','Harvard is a credible alternative, not a verified 100-hour longevity cohort.',
'A buyer can prefer Harvard even when its course does not match our specification. Keep brand competition in the shortlist; keep unmatched courses out of the unit-price benchmark.',
tbl(['Specific offer','What the buyer receives','Price and workload','Why not in the master pricing set?'],[
['Harvard Medical School · Nutrition and Wellness Coaching','Faculty-led content, live sessions, weekly office hours; 29 listed modules across three parts. Certificate of completion.','15 weeks × 4–6 h = 60–90 h estimated. $5,145; ~$1,486/month equivalent, $57.17–85.75/learner h; $177.41/module, not per live class.','A prestigious non-degree alternative. Only the upper end overlaps the screen; different specialization. No fixed installment schedule or verified program-level sales found.'],
['Harvard T.H. Chan · Fundamentals of Longevity Science','8 modules of ~60 minutes, plus progressive capstone assignments.','Course in development; no fee, completed cohort or total workload verified.','Do not present this as an available 100-hour, $2,000 Harvard instructor qualification.'],
['Mayo Clinic · Health and Wellness Coach Training','Online cohort, virtual intensive, written exam and practical assessment. January 2027 schedule numbers 13 sessions.','13 teaching weeks; $4,900 paid in full. ~$1,633/month equivalent; $376.92/numbered session. Total workload NR.','Strong uptake evidence, but no supported tuition per total learner hour. Its later certification conditions are separate.'],
['UC Irvine · AIM Health & Wellness Coaching','Virtual cohort; board-approved training, not board certification itself.','6 months, $6,000; $1,000/month equivalent. 48 live h = $125/live h. About 2 h/week asynchronous plus reading.','Reading time and full workload not quantified. $125/live h is not comparable with tuition per total learner hour.']
],[19,25,29,27]),
'NR = not reported in the cited materials. Ask applicants to choose between two actual offers at their published fees and explain the trade-off: brand, workload, supervision, board pathway or longevity focus.', ['Harvard','Harvard Chan','Mayo 2027','Mayo syllabus','UCI']);
page(6,'06 · LONGEVITY COMPETITORS','The strongest subject matches fail different parts of the screen.',
'A program may be a real substitute in search without being an equivalent purchase. These exclusions prevent an inexpensive self-paced certificate or a physician-only course from setting pilot tuition.',
tbl(['Longevity alternative','Workload / teaching','Price and award','Why excluded from direct pricing'],[
['Certified longevitydocs™ (CLD)','6–9 months, 100+ hours; 10 modules / 50 units; monthly live sessions and peer-reviewed capstone.','$10,000 upfront; $1,111–1,667/month equivalent; $200 per curriculum unit. CLD credential.','Strong match for subject and project; licensed physicians only. Total upper bound, live lesson count and U.S. paid participants not established.'],
['Biohackers World · Health Optimization Coach Training','Evergreen start; up to six months, 4–6 h/week on content plus unquantified daily work. Required workshop, practice and logbook.','$4,499 upfront or 6 × $750 = $4,500. Health optimization coach training.','No verified common-start group cohort or bounded full workload. Global graduate claim is a demand signal only.'],
['IAP · Master Longevity Coaching Professional','120 recommended hours; 12 weeks recommended. Self-directed advanced program.','$297 listed; MLOP designation. Prior training or equivalent required.','Workload and topic match; scheduled live group instruction does not. Not a pilot price floor.'],
['Health Experts Alliance · Longevity Practitioner','6 months, six modules; weekly live training, fortnightly clinical mastermind.','Clinician-oriented certification; public tuition and workload NR.','A genuine group offering, but the public evidence cannot establish unit economics or buyer equivalence.']
],[22,26,25,27]),
'None of these offers cleared every requirement for the same non-clinical learner. That is a finding about what the reviewed sources establish, not proof that no such competitor exists.', ['CLD','CLD curriculum','Biohackers','IAP','HEA']);
page(7,'07 · SELECTION RULE','Benchmark delivery, buyer alternatives and market share separately.',
'Selection was purposive, not a census: search U.S.-facing provider curricula, university and longevity offers, professional directories and program outcomes. The primary-source checks below define the limits of the conclusion.',
tbl(['Evidence layer','Rule / calculation','How it changes the decision'],[
['1 · Direct equivalent','U.S.-facing non-clinical longevity award, online live group, assessed practice, fee disclosed, and full estimated workload in 80–150 hours.','No reviewed offer verified all six. “Top longevity institutions” is not supported.'],
['2 · Format peers','Relax subject only. Primal and HG specify live groups, assessed practice and a bounded weekly total that can be multiplied by teaching weeks.','Compare staffing, delivery intensity and unit economics. Do not transplant their prices or assume equal demand.'],
['3 · Boundary tests','Delgado: 100 contact hours, not total. UVM: 24 × 8–10 = 192–240 hours. UK HCA: 100 learning hours, five modules and group mentoring, £1,500.','Delgado and UVM cannot enter the U.S. workload-matched set. HCA is a useful international format check, not a U.S. price observation.'],
['4 · Buyer alternatives','Keep shorter Harvard, broader board pathways, self-paced longevity, and physician-only credentials visible with their disqualifiers.','Record which exact offer each applicant considered. Named alternatives from paying applicants should update the shortlist.'],
['5 · Demand and share','Request comparable program-level U.S. starts, completions, refund-adjusted paid seats and net tuition for the same trailing 12 months.','Until there is credible population coverage, report seat counts with scope and dates, not market share. Capacity, logos, pass rates and aggregate graduates are not sales.']
],[20,39,41]),'Evidence reviewed 26 Nov 2026. No inferred sales from reviews or testimonials; no provider ranking by brand; no averaging prices across credential classes.', ['Primal','HG workload','Delgado','UVM','HCA','Harvard','CLD']);
})();
