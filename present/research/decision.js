// The meeting ends with a decision. The full research exhibits remain a separate reading path.
(()=>{
const base='https://github.com/gitteromri-ux/lla-barilan-certificate/blob/main/';
const refs={
Proposal:base+'materials/proposal_barilan_health360.pdf',Brief:base+'materials/matan_brief_oct19.md','Appendix A':base+'materials/appendix_a.md',
BLS:'https://www.bls.gov/news.release/ocwage.t01.htm',ONCB:'https://www.oncb.org/wp-content/uploads/2026/01/Updated-White-Paper-Final.pdf',
IAP:'https://www.iapcollege.com/program/longevity-coach-master-professional-certification-course/',UCI:'https://ssihi.uci.edu/education/continuing-integrative-health-education/aim-health-wellness-coaching-certificate-program/',
NBHWC:'https://nbhwc.org/exam-eligibility-requirements/',UKIHCA:'https://www.ukihca.com/scope-of-practice',EU:'https://europa.eu/youreurope/citizens/work/professional-qualifications/regulated-professions/index_en.htm',
'Comparison guide':'https://www.lifecoachmagazine.com/longevity-coach-certification/',ACE:'https://www.acefitness.org/fitness-certifications/bundles/group-fitness-active-aging-coach/',LinkedIn:'https://www.linkedin.com/help/lms/answer/a425662'
};
const box=(tag,title,body)=>`<div class="item"><small>${tag}</small><h3>${title}</h3><p>${body}</p></div>`;
const exhibit=(id,txt)=>`<a class="exhibit" href="?appendix=${id}" target="_blank" rel="noopener">${txt} ↗</a>`;
const pages=[
['01','Recommendation','Test the advisor certificate. Don’t commit to a cohort yet.',
'The proposal defines what a student would learn. The missing evidence is whether professionals will pay for this particular award.',
`<div class="verdict"><div class="herofig"><span>~100</span><b>hours proposed</b><p>45 live · ~30 guided study · ~25 practicum</p></div><div class="pair">${box('What we know','There is a real task to teach.','A learner would assess a longevity claim, plan a response and identify when to refer.')}${box('What we need to learn','Will a working professional pay to do it better?','Show the fee and the limits of the credential before counting a response as evidence about price.')}</div></div>`,
'First, recruit people who can name a client or group they would use the training with.',['Proposal','Brief'],'navy'],
['02','Who to test','Start with working coaches. Test group educators separately.',
'This is a targeting recommendation, not a claim that either group is already buying. Separate the two so one group’s results cannot hide the other’s.',
`<div class="lanes">${box('Primary test','Coaches advising clients','Ask: “What longevity question has a client asked that you felt unprepared to answer?” A real case gives the practicum a purpose.')}${box('Separate test','Educators teaching groups','Ask: “Who would attend your healthy-aging program, and what would you teach?” Separate advisory training from an exercise-instructor qualification.')}</div><div class="notebar"><b>Why not start with all nurses?</b> BLS counts 3,379,720 U.S. registered-nurse jobs. It does not count nurses looking for this certificate.</div>`,
'Once the audience is specific, test what makes the credential worth their time.',['Proposal','BLS','ACE'],'cream'],
['03','Why they might pay','Lead with professional growth, not a salary promise.',
'In an adjacent survey, more than 300 orthopaedic-certified nurses rated the benefits of their own credential. Their answers suggest a message to test, not a forecast for longevity buyers.',
`<div class="plot"><div class="barrow"><b>Indicates professional growth</b><i><u style="width:97.3%"></u></i><strong>97.3%</strong></div><div class="barrow"><b>Contributes to increased salary</b><i><u style="width:48%"></u></i><strong>48%</strong></div></div><div class="notebar"><b>How to test it:</b> Show an assessed case, then ask prospects for their single main reason to enroll. Record career growth, practical skills and required credential separately.</div>`,
'If buyers want professional recognition, the next question is exactly what the title lets them claim.',['ONCB','Appendix A'],'teal'],
['04','What the buyer gets','The proposed award is for non-clinical advice, not a license.',
'Use the full proposed title: Certified Longevity and Lifelong Wellbeing Advisor. “Instructor” describes a possible buyer, not the credential Bar-Ilan is proposing to issue.',
`<div class="lanes">${box('What to demonstrate','A supervised advisory case','Show how a learner reviews evidence, develops a wellbeing plan and identifies when to refer. Show who assesses that work.')}${box('What not to promise','New clinical or board authority','No new right to diagnose or prescribe. U.S. board certification has separate requirements; European rules depend on profession and country.')}</div><div class="notebar">${exhibit(8,'U.S. credential comparison')} ${exhibit(9,'European credential comparison')}</div>`,
'Price comparisons are useful only after we know which kind of credential and instruction we are comparing.',['Proposal','NBHWC','EU','UKIHCA'],'navy'],
['05','What to charge','Competitors charge $297 and $6,000 for different things.',
'Each online alternative matches one part of the proposal. Neither tells us what U.S. learners will pay for the whole advisor certificate.',
`<div class="comp">${box('Total workload match','US$297','IAP: 120 recommended hours of self-directed longevity study. Advanced private designation; prior training or equivalent required.')}${box('Proposed pilot','Fee undecided','About 100 total hours, including 45 live hours and a supervised practicum. The final delivery mix and award wording still need approval.')}${box('Live instruction match','US$6,000','UC Irvine: 48 live hours plus independent work. Health and wellness coaching with a board-approved training pathway, not a longevity designation.')}</div>`,
'Approve a fee or labeled research range, then show it to people who are already comparing training.',['IAP','Proposal','UCI'],'cream'],
['06','Where to reach them','Start with credential searches. Use LinkedIn to test professional fit.',
'A person comparing tuition gives a different signal from a person with a relevant job title. Keep the sources separate and use the same fee and qualifying questions.',
`<div class="routes">${box('Capture active comparison','Google Search','Test “longevity coach certification cost” separately from “healthy aging instructor certification.” Send each to a page comparing award, hours and fee.')}${box('Understand the shortlist','Comparison guides','Life Coach Magazine compares longevity courses. ACE offers an active-aging instructor route. Ask which alternative the prospect is considering, and why.')}${box('Explore a new audience','LinkedIn','Test working coaches and group educators separately. Ask for a case or teaching goal. Compare cost per qualified inquiry after fee disclosure; do not scale on clicks.')}</div>`,
'The channel that produces the most forms is not necessarily the one that produces students. Judge the pilot on both.',['Comparison guide','ACE','LinkedIn','Appendix A'],'teal'],
['07','Decision for the meeting','Approve the demand test today. Make launch a separate vote.',
'The October brief sets inquiry and enrollment targets. Neither target is an observed result, and reaching the inquiry target alone should not trigger launch.',
`<div class="gates">${box('Before recruitment','Approve the offer','Academic lead: finalize the title, scope and workload. Commercial lead: authorize the fee, media cap and maximum acceptable cost per paid seat.')}${box('December checkpoint','≥334 inquiries','By Dec 31: count unique relevant U.S. inquiries, then report how many saw the fee. Break out coaches, educators and channel. The test is scheduled to continue into January.')}${box('January decision','≥10 enrollments','By Jan 31: reconcile enrollments with actual payments and acquisition costs. Proceed only if economics and academic approvals support launch; otherwise revise or pause.')}</div><div class="endlink">${exhibit(1,'Open all 24 supporting exhibits')}</div>`,
'The decision today is permission to test demand, not permission to promise a February start.',['Brief','Proposal','Appendix A'],'navy']
];
const old=[...document.querySelectorAll('.s')].slice(9);
const ap=new URLSearchParams(location.search).get('appendix');
window.evidenceStart=ap===null?null:Math.min(old.length,Math.max(1,parseInt(ap)||1))-1;
if(window.evidenceStart!==null){document.querySelectorAll('.s').forEach((s,i)=>{if(i<9)s.remove()});}
else{
 const pos=old[0];for(const [no,kicker,title,sub,body,next,sources,tone] of pages){
 const el=document.createElement('section');el.className='s decision '+tone;
 el.innerHTML=`<article class="sheet"><header><b>BAR-ILAN × LONGEVITY LIFE ACADEMY</b><b>RESEARCH BRIEF &nbsp; / &nbsp; ${no} OF 07</b></header><div class="chapter">${kicker}</div><h1>${title}</h1><p class="dek">${sub}</p><main>${body}</main><aside><b>${no==='07'?'CONCLUSION':'SO WHAT?'}</b><span>${next}</span></aside><footer><b>SOURCES</b>${sources.map(s=>`<a href="${refs[s]}" target="_blank" rel="noopener">${s}</a>`).join('')}</footer></article>`;pos.before(el)
 }
 old.forEach(s=>s.remove());
}
})();
