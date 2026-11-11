/* Entries, part 0: the first seven structures. Each case: forces[].how is a short paragraph tied to the example; together explains how the forces fed each other. scene says which example the animation belongs to. */
Object.assign(FG.entries, {
  autocracy:{
    actors:"1 decides · 6 affected", scene:"risky",
    summary:"One person deciding is the fastest and clearest way to decide: one person makes the call and everyone knows who did. It works when speed matters, the decider already has the information, and people trust them for this kind of decision. It fails when the people affected know things the decider doesn't, or can't safely say no, because then the silence that follows looks like agreement.",
    useful:{bullets:["The person deciding knows things the others don't.","People accept that this kind of decision is theirs to make.","Safety or fairness depends on one person making the call.","The decider can explain the reasons, even if not everyone likes them."],
      title:"A chemistry teacher assigns lab pairs", where:"A government primary school in Pune",
      text:"A teacher smells gas in the science block at 11 am. The principal orders an evacuation within two minutes, without asking anyone. Staff follow the drill they practised in term one, and all 400 students are on the field eight minutes later.",
      why:"The teacher knew which students work carefully and which need support, and lab safety is accepted as her call. She explained her reasons at the start, so students who wanted their friends understood the choice even if they did not like it.",
      forces:[
        {f:"zone_acceptance",gen:"People go along readily when they see the decision as the decider's to make.",e:"helps",how:"Students expect the teacher to make safety calls in the lab, so the pairing fell inside what they accept from her. Some grumbled, but no one contested it."},
        {f:"fair_process",gen:"Explaining the reasons helps people accept a call they do not like.",e:"helps",how:"She explained her reasons before anyone asked. People accept an outcome they dislike more readily when they understand how and why it was decided."},
        {f:"homophily",gen:"One person assigning groups avoids people sorting into cliques and leaving others out.",e:"helps",avoided:true,how:"Left to choose, students pair with friends who are like them, and the same few are left until last. The teacher's list meant no one was picked last."}],
      together:""},
    risky:{bullets:["The decision affects people who know things the decider doesn't.","It is made quickly, under budget pressure.","No one asks the staff who will have to deal with the effects.","There is no way to raise a concern before the decision is made."],
      title:"The head of activities cancels swimming for the year", where:"", text:"",
      why:"With the coach gone and money tight, cancelling swimming looked like an easy saving. The head of activities decided alone, and only afterwards did the effects on teachers and students show.",

      forces:[
        {f:"independent",e:"hurts",st:"hurt",gen:"One judgment made alone has no other views to catch its mistakes.",how:"He weighed the saving on his own, with no one to point out what it would cost others."},
        {f:"local_knowledge",e:"hurts",st:"ignored",missing:true,gen:"What the people closest to the situation know may never reach the decider.",how:"Teachers knew how the change would affect their lessons and students, but no one asked them."},
        {f:"fair_process",e:"hurts",st:"ignored",gen:"A decision announced without reasons or a say is harder to accept.",how:"Teachers and students heard once it was final, with no chance to suggest another way."}],
      together:"",
      model:{type:"iceberg", layers:[
        ["What everyone sees","A 15% rise goes out by message. A few complain; most stay quiet."],
        ["The pattern over time","Families quietly ask for transfer certificates, and the principal sets up payment plans one family at a time."],
        ["The structure causing it","Only the owner decides. Parents and teachers have no way to raise concerns before a decision is made."],
        ["The beliefs holding it in place","“The owner knows the finances best.” And, among parents: “If I complain, my child may be treated differently.”"]],
        note:"An iceberg shows how a single event sits on top of a pattern, a structure and the beliefs underneath. The structure and the beliefs are where change is possible."}},
    tips:["Keep one-person decisions for emergencies and for choices people are happy to leave to you.","Before a decision that affects other people, ask a few of them first, even informally.","Watch what people do in the weeks after an announcement, because quiet can hide disagreement."],
    refs:["vroom1973","bridges1967","hoy2008","barnard1938","kim1997","mcpherson2001","hirschman1970","hayek1945","noelle1974","ramchandani2019"]
  },
  consultative:{
    actors:"1 decides · 4 advise", scene:"risky",
    summary:"In consultative decision making, one person decides after asking others for advice. It keeps the speed and clear responsibility of a single decider while drawing on what other people know. It works when the decider gathers views before settling on their own and tells people afterwards how their advice was used. It fails when people get too little time or information to give useful advice, or when the decision is already made.",
    useful:{bullets:["The people affected know things the decider needs.","Someone has to be clearly responsible for the final call.","There is time to gather views before deciding.","The decider is willing to change their mind."],
      title:"A head chooses a reading scheme after asking her teachers", where:"",
      text:"",
      why:"The teachers knew their weakest readers better than the head did, and writing first kept each view separate. She said at the start that the decision was hers, and explaining her choice afterwards showed the advice had counted.",
      forces:[
        {f:"local_knowledge",e:"helps",gen:"The people doing the work often know what the decider needs.",how:"The teachers saw how their weakest readers coped with each scheme. The head could not have seen that from her office."},
        {f:"independent",e:"helps",gen:"Gathering views separately, before any discussion, stops the first or loudest view from shaping the rest.",how:"Each teacher wrote a note before talking to anyone, so separate judgements reached the head instead of one shared impression."},
        {f:"fair_process",e:"helps",gen:"Saying who decides at the start, and explaining afterwards, helps people accept the result.",how:"She told staff at the start that she would decide, and afterwards explained how their notes shaped the choice. Teachers whose scheme lost still felt heard."}],
      together:""},
    risky:{bullets:["People have too little time to read, ask questions and reply.","They get a form but not the facts they need to answer it.","Only those with time to spare hear about it or reply.","The decision date is fixed before the consultation starts."],
      title:"A principal consults parents with little deliberation time", where:"",
      text:"",
      why:"Five days and one letter gave parents no time to ask questions or talk it over. Few replied, and those who did had little to go on. The principal decided on thin advice, and the families most affected heard about the change only when it began.",
      forces:[
        {f:"influence_few",e:"hurts",gen:"When few people take part, a small group can speak for everyone.",how:"The parents with time to reply that week shaped the advice. Working parents, who would need Friday childcare, were mostly missing."},
        {f:"shared_info",e:"hurts",gen:"People give useful advice only when they have the facts the decider has.",how:"The letter gave no details on childcare or cost, so parents could not judge what the change would mean for them."}],
      together:""},
    tips:["Say at the start that you are asking for advice and will decide yourself.","Give people enough time and facts to answer, and a way to ask questions.","Gather views separately, in writing if you can, before any group discussion.","Tell people afterwards what you decided and how their advice shaped it."],
    refs:["vroom1973","vroom1988","hayek1945","kim1997","ramchandani2019"]
  },
  majority:{
    actors:"every vote counts the same · more than half wins", scene:"useful",
    summary:"In majority rule, everyone votes and the option with more than half the votes wins. It is quick, easy to understand and treats every vote the same. It works when the people voting are the people affected, and when losers expect to win another time. It fails when only some of those affected turn up, or when the same group keeps losing.",
    useful:{bullets:["Many people need to choose between clear options.", "Everyone affected can take part.", "The decision can be revisited if it goes wrong.", "Losing this time does not mean losing every time."],
      title:"Students vote on how to spend part of their school's budget", where:"", text:"",
      why:"Students wrote the proposals, campaigned for them and voted, so the winning project had visible support. Every vote counted the same, and the budget came back each year, so a losing idea could try again. Winners included school radios and alerts for deaf students.",
      forces:[
        {f:"fair_process",e:"helps",gen:"People accept a result more readily when they shaped the options and had an equal say.",how:"Students wrote the proposals themselves and each had one vote, so even those who lost could see how the winner was chosen."},
        {f:"accountability",e:"helps",gen:"A vote is trusted more when someone must deliver the result by a date.",how:"Each school had to carry out the winning project within the year, so students saw their vote turn into something real."}],
      together:""},
    risky:{bullets:["Only some of those affected turn up to vote.", "The vote is held at a time that suits some groups more than others.", "The same group keeps losing.", "A narrow win is treated as a clear mandate."],
      title:"A school district puts a tax vote to a special election", where:"", text:"",
      why:"Majority rule counts only those who vote. In special elections, turnout is often in single digits and nearly half of voters are over 50. Researchers found school tax measures fail more often in these elections than when many people vote.",
      forces:[
        {f:"influence_few",e:"hurts",gen:"When few people take part, a small group can decide for everyone.",how:"With so few voters, a small group that did not look like the district's families decided school funding for all of them."},
        {f:"fair_process",e:"hurts",gen:"When the timing of a vote suits some groups more than others, the result loses legitimacy.",how:"Holding the vote apart from major elections drew voters much older than the families affected, so the result spoke for a minority."}],
      together:""},
    tips:["Check who is missing before you count: hold the vote when and where those affected can take part.", "Agree in advance what happens if the result is very close.", "Look for groups that keep losing, and ask what they need.", "Revisit the decision after a set time."],
    refs:["may1952", "kogan2018", "ramchandani2019"]
  },
  consent:{
    actors:"a circle · no reasoned objection", scene:"useful",
    summary:"In sociocratic consent, a proposal goes round the circle and passes when no one has a reasoned objection, meaning a reason it would cause harm or set the group back. Objections are used to improve the proposal, and decisions come with a review date. Holacracy adds a fixed script of turns for questions, reactions and objections. It works when people feel safe to object. It fails when proposals always come from the top and newer members stay quiet.",
    useful:{bullets:["Waiting for everyone to fully agree would take too long, but every objection still needs to be heard and worked into the proposal.","Everyone can speak in turn, one at a time.","The decision can be reviewed after a set time.","People feel safe to raise objections."],
      title:"A Grade 7 team decides on a homework limit", where:"", text:"",
      why:"Each person answered in turn, so the science teacher's objection surfaced even though everyone before her had consented. The proposal was amended instead of argued over, and the six-week review meant the team could fix anything they got wrong.",
      forces:[
        {f:"conformity",e:"helps",gen:"Answering in turn, out loud, makes it harder to hide behind the group.",how:"The science teacher could not hide in a show of hands, so her objection came out even after five colleagues had consented."},
        {f:"pluralistic_ignorance",e:"helps",gen:"Asking everyone directly stops silence being mistaken for agreement.",how:"Each person said consent or object out loud, so the team could see real agreement instead of assuming it."}],
      together:""},
    risky:{bullets:["Day-to-day operational decisions go to a full round, not just policy.","Urgent day-to-day matters wait for the next meeting.","Meetings run long, and people start to nod proposals through.","No one has the authority to act between meetings."],
      title:"A leadership team uses consent rounds for its policies, then for every day-to-day decision too", where:"", text:"",
      why:"Consent rounds worked well for the team's policies, which change rarely and affect everyone. Then the team used them for day-to-day operations too: covering an absent teacher, moving a trip, ordering supplies. Every small decision waited for a full round, meetings ran long, and urgent matters were held up. Staff began to consent without reading. Consent suits policy; operational calls need one person with clear authority to act, within limits the group has agreed.",
      forces:[
        {f:"diffusion",e:"hurts",gen:"When every decision needs the whole group, no one feels able to act alone.",how:"No one could act on an urgent matter without a round, so each waited for the next meeting."},
        {f:"conformity",e:"hurts",gen:"When a process becomes a ritual, people go along with it without thinking.",how:"Tired of long rounds, staff consented to whatever was proposed, so a consent no longer meant anyone had read it."}],
      together:""},
    tips:["Go round in turns, so everyone gives an answer.","Ask whether people can live with it, and whether it is safe to try.","Set a review date for every decision.","Let anyone bring proposals, and thank people who object."],
    refs:["endenburg1998","rau2018","mead2003","ramchandani2019","ramchandani2025"]
  },
  citizens_assembly:{
    actors:"many invited · a group drawn by lot · a body decides", scene:"useful",
    summary:"In a citizens' assembly, a group drawn by lottery, not elected or appointed, learns about an issue, hears from many sides and recommends what to do. Because no one knows in advance who will serve, no one can lobby them, and a group drawn to match the community brings views an expert panel would miss. It works when the body that called it is bound to respond. It fails when that body keeps the final say and uses it without explanation.",
    useful:{bullets:["An issue is contested and trust in the usual deciders is low.","A cross-section of the community would judge it better than any expert panel.","The body that calls it is bound to respond, in public and by a date.","There is time for members to learn and deliberate over several sessions."],
      title:"Residents drawn by lot advise a regional parliament on inclusive schools", where:"", text:"",
      why:"The lottery meant no lobby group could choose the members. A law required parliament to answer every recommendation in public and report back a year later, so the work could not quietly disappear. Several recommendations became policy, including a new advisory council for people with disabilities.",
      forces:[
        {f:"influence_few",e:"helps",gen:"When no one knows in advance who will decide, organised groups lose the head start they usually have.",how:"Members were drawn by lottery and matched to the region, so no lobby group could pick them. Every interest had to make its case in the room."},
        {f:"accountability",e:"helps",gen:"A body that must answer in public, by a date, takes a recommendation more seriously.",how:"Parliament had to respond to each recommendation in a public session and report back a year later, with members invited to hear it."}],
      together:""},
    risky:{bullets:["The people who decide keep the final say and promise only to take the result seriously.","There is no duty to answer each recommendation, or to explain a no.","The deciders treat members' judgement as less valid, for example because of their age.","Members give their time and never hear what happened to their work."],
      title:"A school draws students by lot to advise on its phone policy", where:"", text:"",
      why:"Leadership kept the final say and owed the assembly no answer. It adopted the easy points, dropped the one it disliked on the grounds of the students' age, and never told the students why. The next year most students drawn by lot declined to serve, so the assembly lost the cross-section that made it worth having.",
      forces:[
        {f:"accountability",e:"hurts",gen:"A body with no duty to answer, and no date to answer by, can let a recommendation quietly lapse.",how:"Leadership promised only to take the recommendations seriously. Nothing required it to answer each one, so the lunch rule was dropped without a reply."},
        {f:"fair_process",e:"hurts",gen:"People whose advice is set aside without explanation stop trusting the process.",how:"The students had spent three sessions on the question, then heard about the decision second-hand, with no reasons given to them."},
        {f:"exit_voice",e:"hurts",gen:"When taking part seems pointless, people stop taking part instead of complaining.",how:"The next year most students drawn by lot declined to serve. They did not protest; they simply said no."}],
      together:""},
    tips:["Agree in advance, in writing, how the deciding body will respond to the recommendations, and by when.","Give members the real constraints, such as budgets and contracts, not just background evidence.","Bring in the people who must carry out the changes before the recommendations are final.","Ask who picked the speakers and the questions.","Remember that the lottery's weighting choices, such as who counts as local and which ages are included, are themselves decisions."],
    refs:["farrell2019","oecd2020","fishkin2009","ramchandani2025"]
  },
  dot_voting:{
    actors:"same dots for everyone · stack or spread", scene:"useful",
    summary:"In dot voting, everyone gets the same number of points, often sticky dots, and places them however they like: all on one option or spread across several. The options with the most dots win. It shows how strongly people feel as well as what they prefer, and needs only stickers and a wall. It fails when a keen group stacks all its dots on one option and outweighs wider, quieter support.",
    useful:{bullets:["There are many options and only a few can go ahead.","You want to see how strongly people feel, not just what they like.","The group is in one room, with time to look at the options.","The result guides a decision, rather than settling something high-stakes."],
      title:"Staff choose priorities for next year's school improvement plan", where:"", text:"",
      why:"Eight priorities were on the wall and only two could be funded. Each teacher had five dots, so the result showed which priorities many staff cared about, and how much. The two with the most dots went into the plan, with the dot count as a record of support.",
      forces:[
        {f:"independent",e:"helps",gen:"Collecting views before discussion stops the loudest voice setting the result.",how:"Teachers placed their dots before any debate, so each person's view counted before anyone argued for a favourite."},
        {f:"shared_info",e:"helps",gen:"When everyone can see the same picture of support, the next conversation starts from facts.",how:"The wall showed at a glance where support was strong, weak or split, so the follow-up discussion was short."}],
      together:""},
    risky:{bullets:["A keen group can coordinate where to put its dots.","People can see where others have placed theirs before they vote.","The options differ a lot in how many people care about them.","The result is treated as binding with no discussion."],
      title:"A student council uses dots to choose its fundraiser", where:"", text:"",
      why:"Each extra dot cost the same, so six friends who put all five dots on one option outweighed the wider support for another. The count looked like broad backing when it was one keen group. Pricing dots so that stacking costs more, as in quadratic voting, would have shown the real balance.",
      forces:[
        {f:"influence_few",e:"hurts",gen:"When points can be stacked, a small keen group can outweigh a larger, quieter one.",how:"Six students stacked 30 dots on one fundraiser, more than the 20 dots that ten students gave the option most of them liked."},
        {f:"cascade",e:"hurts",gen:"When people vote one after another in public, early votes sway later ones.",how:"The stacked column was visible early, and later voters added to it because it looked like the winner."}],
      together:""},
    tips:["Ask people to place their dots before any discussion, ideally at the same time.","Limit how many dots one person can put on a single option.","If stacking is a risk, make each extra dot on the same option cost more (quadratic voting): one dot costs 1 point, two cost 4, three cost 9.","Treat the result as a guide and discuss the top options before deciding."],
    refs:["lalley2018","weyl2024"]
  },
  score_voting:{
    actors:"everyone rates every option · best rating wins", scene:"useful",
    summary:"In score voting, everyone rates every option, for example from 0 to 5 or from Excellent to Reject. The option with the best rating wins. With the average, every rating counts, but people who exaggerate can sway it. With the median, the middle rating, known as majority judgement, exaggerating has little effect. It works when people can judge every option, and fails when a group gives its favourite the top rating and everything else the bottom.",
    useful:{bullets:["There are several options and people can judge each one.","You want an option most people find good, not one that some love and others hate.","People are used to grading, as teachers and students are.","You can use the median, or the middle rating, to limit exaggeration."],
      title:"A school council grades four designs for the new playground", where:"", text:"",
      why:"Every member graded every design, from Excellent to Reject. One design had passionate fans and strong critics, while another was graded Good by almost everyone. Using the middle grade, the broadly liked design won, and few people were unhappy with the result.",
      forces:[
        {f:"independent",e:"helps",gen:"Rating each option separately stops people from treating the vote as all or nothing.",how:"Members judged each design on its own, so a design they liked second still got a fair grade."},
        {f:"polarization",e:"helps",gen:"A rule that rewards broad support takes the heat out of a two-camp contest.",how:"The divisive design could not win on its fans alone, so the argument moved to what most people could accept."}],
      together:""},
    risky:{bullets:["The winner is chosen by average rating.","A group cares a lot about one option and can agree how to rate.","Voters see the vote as a contest to win, not an honest rating.","No one checks how the ratings are spread."],
      title:"Students rate three options for a class trip", where:"", text:"",
      why:"Fourteen students gave their favourite 5 and every other trip 0, while most of the class gave the broadly liked trip a 3. On the average, the favourite of a minority won. The median, the middle rating, would have chosen the trip most students rated acceptable.",
      forces:[
        {f:"influence_few",e:"hurts",gen:"When the average decides, people who exaggerate count for more.",how:"Fourteen students rated in extremes and outweighed sixteen who rated honestly."},
        {f:"polarization",e:"hurts",gen:"When people treat a rating as a contest, they rate in extremes.",how:"Once some students rated to win, the ratings stopped showing what anyone thought of each trip."}],
      together:""},
    tips:["Use the median, or middle rating, when exaggeration is likely.","Use words for the grades, such as Excellent, Good, Acceptable, Poor, Reject.","Ask people to rate every option, not just their favourite.","Look at how ratings are spread before announcing a winner."],
    refs:["balinski2011"]
  },
  quadratic:{
    actors:"8 voters · 4 projects", scene:"useful",
    useful:{title:"Four projects, one budget", where:"A university students' union in Taipei",
      text:"The union can fund one of four projects: a longer-hours library, a sports-field upgrade, solar panels or a quiet wellbeing room. Each voter gets 16 credits. One vote costs 1 credit, two cost 4, three cost 9 and four cost 16. Most voters spread their credits. Two voters put all 16 into 4 votes for the wellbeing room. In a one-person-one-vote poll the sports field would win narrowly, but with quadratic voting the wellbeing room comes first.",
      why:"The rising price lets a few people show that they care a lot, without letting anyone take over. The project with the strongest support wins over the one with the widest mild support.",
      forces:[
        {f:"influence_few",e:"helps",how:"The two students who cared most about the wellbeing room could show it, but each extra vote cost them more. Spending everything bought them only four votes, so no one could swamp the result."},
        {f:"cumulative",e:"helps",how:"Each student allocated credits privately, without seeing a running total. Early leaders could not pull in later voters, so the result reflected how much people cared rather than what looked popular."}],
      together:"The squared price let strong feelings count without letting them take over, and private allocation stopped popularity from snowballing. Between them, the result showed both how many people wanted something and how much they wanted it, which a simple count cannot do.",
      loop:{type:"B", nodes:["Votes on one project","Price of the next vote","Willingness to add another vote"], signs:["+","−","+"], note:"The rising price is a balancing loop built into the rules, and it stops any one voter from piling on."}},
    risky:{title:"Credits nobody understood", where:"A secondary school council in Lisbon",
      text:"The council introduces quadratic voting for its annual budget with no practice round. Many younger students put all their credits on one project, not realising it bought them only four votes. A group of older students who understood the rule agreed to split their credits across three projects, and those three took most of the budget.",
      why:"The method only measures how strongly people feel if they understand the price. Here the people who understood it best could coordinate around it.",
      forces:[
        {f:"coordination",e:"hurts",how:"The older students agreed in advance how to split their credits, so their votes landed where they would count most. Younger students, voting alone, had no plan to match."},
        {f:"influence_few",e:"hurts",how:"A small group who understood the price shaped most of the budget. The rule was meant to limit any one voice, but it gave an advantage to whoever understood it."}],
      together:"Not understanding the rule turned it upside down. The students who did understand it could coordinate, and coordination let a few people decide most of the outcome. A practice round would have spread that understanding before it mattered."},
    tips:["Run a practice round with a made-up budget first.","Equal credits don't mean equal power if some voters coordinate in groups.","It shows how strongly people feel. Someone can feel strongly and still be badly informed."],
    refs:["lalley2018","posner2018"]
  },
  nemawashi:{
    actors:"1 proposes · 4 visited · 1 not visited", scene:"useful",
    useful:{title:"Changing the timetable without a fight", where:"A private secondary school in Osaka",
      text:"The deputy head wants to move from 50-minute to 60-minute periods. Over three weeks she meets each department head, the PE teacher who runs the after-school clubs, and the PTA chair, one at a time. The club coach worries that practice will start later, so she changes the plan to keep the end of the school day the same. By the staff meeting everyone she spoke to has seen their concern dealt with. The change is approved in ten minutes and runs smoothly from April.",
      why:"Concerns came up in private, where they were safe to raise, and the plan changed before anyone had to take a public position. Because everyone affected had already agreed, the change was quick to carry out: slow to decide, fast to implement.",
      forces:[
        {f:"spiral_silence",e:"helps",how:"The coach would probably not have raised his worry in a full staff meeting. One-to-one, with no audience, it was easy to say, and the plan changed because of it."},
        {f:"independent",e:"helps",how:"Each person gave their view before hearing anyone else's. The deputy head collected five separate opinions, not one group mood."}],
      together:"Private conversations made it safe to disagree, and talking to people separately kept their views independent. The proposal improved with each visit. By the time of the meeting there was nothing left to argue about, so the decision was quick and the change was easy to carry out."},
    risky:{title:"The teacher nobody visited", where:"A public junior high school in Sendai",
      text:"The principal plans to merge two after-school clubs. She talks it through with the vice-principal, the senior club adviser and the PTA executive, and all of them agree. No one visits the second-year teacher who coaches the smaller club, or its parents. At the staff meeting the merger is presented as settled. The coach has doubts but says nothing, since every senior colleague has already signed off. That term the smaller club's members drift away, and two families complain to the board of education. Asked who made the decision, no one can say.",
      why:"The proposer chose whom to visit, so the people left out never had a say. By the time of the meeting, objecting meant contradicting everyone senior in public. And because so many people had agreed, no one person owned the result.",
      forces:[
        {f:"influence_few",e:"hurts",how:"The principal decided whom to visit and in what order. The people she skipped had no other way in, so a handful of conversations decided the outcome for everyone."},
        {f:"conformity",e:"hurts",how:"By the meeting, every senior person had already agreed. For the coach, objecting meant standing alone against all of them in public."},
        {f:"spiral_silence",e:"hurts",how:"The coach assumed that if anyone else had doubts they would have spoken. She stayed quiet too, which kept the room looking united."}],
      together:"Choosing whom to visit decided whose concerns counted. Once all the senior people had agreed in private, the meeting turned into a formality where objecting carried a high social cost. The silence that followed looked like agreement, and because so many people had nodded the plan through, no one felt responsible when it went wrong.",
      loop:{type:"R", nodes:["Decisions settled in private talks","Cost of objecting in the meeting","Objections raised in meetings"], signs:["+","−","−"], note:"Two negative links make this loop reinforcing. The less meetings are used to disagree, the more gets settled before them."}},
    tips:["List everyone the decision affects, then check who is missing from your visits.","Leave a real chance to change the plan at the meeting, and say so.","Once the decision is made, name who is responsible for it, so that shared agreement doesn't become no one's decision.","Expect it to take weeks. It is slow to decide and quick to carry out."],
    refs:["fetters1995","liker2004","noelle1974","asch1956"]
  }
});
/* Entries, part 1: Command */
Object.assign(FG.entries, {
  oligarchy:{
    actors:"5 decide · many affected", scene:"risky",
    summary:"In oligarchic decision making, a small group decides for everyone else. The group may be chosen for its expertise or seniority, or simply because it has always run things. It works when the few know things the many do not and their reasons can be checked from outside. It fails when the group trusts its own methods over the people closest to the case and no one outside can correct it in time.",
    useful:{bullets:["The decision needs specialist knowledge most people don't have.","A small group can meet quickly and compare notes.","The group's reasons can be published and checked.","There is a way to appeal if the group gets an individual case wrong."],
      title:"Senior examiners set the grade boundaries for a national maths exam", where:"", text:"",
      why:"Setting boundaries needs judgement few people have, and it must happen quickly once marking ends. Each examiner judged scripts alone before the meeting, and publishing the boundaries let every school check the result.",
      forces:[
        {f:"local_knowledge",e:"helps",gen:"A small group chosen for what it knows can see what most people cannot.",how:"The senior examiners had marked thousands of scripts and knew what work at each grade looks like. Few teachers could judge that across a whole country."},
        {f:"independent",e:"helps",gen:"Asking members to judge alone before meeting stops the most senior voice from setting the answer.",how:"Each examiner reviewed sample scripts alone before the meeting, so the group started from separate judgements."},
        {f:"accountability",e:"helps",gen:"A group that expects to explain its choice to others tends to think it through more carefully.",how:"The boundaries are published on results day, so the examiners knew every school would scrutinise each choice."}],
      together:""},
    risky:{bullets:["The decision affects many people the group never meets.","The people who must carry it out had little part in shaping it.","It applies everywhere at once, with no trial in a few places first.","The group judges the plan on paper, not on what it costs the people living with it."],
      title:"An expert panel designs a new national curriculum", where:"", text:"",
      why:"A small panel wrote a curriculum for millions of children and made it compulsory everywhere at once. Teachers had little say in its design, so many could not interpret it, and families bore costs no one had tested. The problems surfaced through complaints years later.",
      forces:[
        {f:"local_knowledge",e:"hurts",gen:"What the people closest to the work know can be missed by a plan made far away.",how:"Teachers knew what their classrooms, materials and parents could manage. With little part in the design, that knowledge reached the panel only after the rollout."},
        {f:"fair_process",e:"hurts",gen:"People accept a hard decision more readily when they had a real say in it.",how:"Teachers and parents had no part in shaping the plan, so its new demands and costs felt imposed, and complaints grew instead of fixes."}],
      together:""},
    tips:["Write down who the group is deciding for, and how those people can raise a concern before the decision.","Ask members to judge privately before discussing.","Test the decision on real cases before applying it to everyone.","Publish the reasons, and give individuals a way to appeal."],
    refs:["michels1915","lerner1999","hayek1945"]
  },
  chain_of_command:{
    actors:"1 at the top · 2 below · 4 below them · 8 on the front line", scene:"risky",
    summary:"In a chain of command, decisions pass down a hierarchy one level at a time, and each person answers to the one above. Militaries and large organisations rely on it because it spreads a clear instruction quickly to many people. It works for simple, routine decisions where everyone knows their job. It fails when information has to travel back up, because each level softens bad news before passing it on.",
    useful:{bullets:["The instruction is simple and does not need interpreting.","Many people across a large area need to act together.","Everyone knows who they answer to and who to ask.","Speed and consistency matter more than local variation."],
      title:"A state health department runs a deworming day through every school", where:"", text:"",
      why:"The task was simple and the same for every school, so one instruction could pass down unchanged. Each level knew whom to train and whom to report to, so a single day reached thousands of schools.",
      forces:[
        {f:"coordination",e:"helps",gen:"When everyone expects everyone else to follow the same plan, a single instruction is enough to start it.",how:"Every school gave the tablets on the same day, so absent children could be caught on one mop-up day and reports could be compared."},
        {f:"zone_acceptance",e:"helps",gen:"People carry out instructions they see as part of the decider's role without needing to be persuaded.",how:"Teachers saw giving one tablet on a set day as a reasonable request from the health department, so it went ahead without debate."}],
      together:""},
    risky:{bullets:["Bad news has to travel up the chain to the person who decides.","Each level is judged on how calm things look.","There is no direct route from the bottom to the top.","Concerns are passed on by word of mouth, not in the original words."],
      title:"A teacher's workload complaint passes up to the principal", where:"", text:"",
      why:"Each step up the chain softened the message a little. No one lied, but by the time it reached the person who could act, the complaint sounded routine, and the teacher concluded that nothing would change.",
      forces:[
        {f:"mum_effect",e:"hurts",gen:"People hold back or soften bad news, especially when passing it to someone above them.",how:"No one wanted to tell their manager that a colleague was struggling, so each level passed on a gentler version."},
        {f:"message_drift",e:"hurts",gen:"A message passed from person to person is shortened and smoothed at each step.",how:"Each level heard only the version from the level below, with nothing in writing, so no one could see how much the complaint had changed."},
        {f:"exit_voice",e:"hurts",gen:"When speaking up feels pointless, people leave instead, and the warning is lost.",how:"When raising the problem changed nothing, the teacher stopped complaining and started applying for other jobs."}],
      together:""},
    tips:["Use a chain for routine, clear instructions, and other routes for anything that needs judgement.","Give people at the bottom a direct route to the top for serious concerns.","Pass warnings on in writing, in the original words."],
    refs:["simon1947","rosen1970","bartlett1932","hirschman1970"]
  },
  advice_process:{
    actors:"1 decides · 3 advise · 1 not asked", scene:"useful",
    summary:"In the advice process, anyone can make a decision, as long as they first ask the people affected and the people who know most. It puts decisions close to the work without needing a manager's approval. It works when the decider seeks out different views, including people likely to disagree. It fails when the decider asks only the people around them, so those most affected are never heard.",
    useful:{bullets:["The person closest to the problem is well placed to decide.","The people who know most are spread across the organisation.","The decision and the advice can be posted for everyone to see.","Mistakes can be spotted and corrected afterwards."],
      title:"A biology teacher decides which microscopes to buy", where:"", text:"",
      why:"The teacher closest to the problem decided, with advice from people who knew more about cost and repairs. Posting the decision and the advice kept it open to everyone.",
      forces:[
        {f:"local_knowledge",e:"helps",gen:"The people who know most about a problem are often outside the usual chain of approval.",how:"The finance officer knew the cheaper model broke often, and a student who repairs lab equipment knew which parts fail. The teacher alone would not have known."},
        {f:"independent",e:"helps",gen:"Advice gathered one person at a time, from different angles, adds up to more than one group opinion.",how:"Each adviser gave a view separately, from their own angle of teaching, money or repairs, so the teacher heard three different kinds of knowledge."},
        {f:"accountability",e:"helps",gen:"Making the decision and the advice public lets others check who was asked.",how:"She posted her decision and the advice she got on the staff board, so anyone could see who she had asked."}],
      together:""},
    risky:{bullets:["The decider chooses whom to ask.","The people most affected are not in the decider's usual circle.","The advisers already share the decider's view.","No one checks who was asked before the decision takes effect."],
      title:"A principal asks only her own team about a new behaviour policy", where:"", text:"",
      why:"The advice process depends on asking the people affected. The principal asked the people closest to her, who already agreed with her, so the students and families most affected were never heard.",
      forces:[
        {f:"homophily",e:"hurts",gen:"Deciders tend to ask the people they already work with, who are often like them.",how:"Her deputies and the behaviour lead were the people she worked with every day. The special education coordinator, teachers' representatives and parents were outside that circle."},
        {f:"groupthink",e:"hurts",gen:"A close group of like-minded advisers rarely challenges the decider.",how:"The three advisers shared the principal's view of discipline, so no one pushed back on the idea that more suspensions would help."}],
      together:""},
    tips:["Write down who counts as affected and who knows most before you start asking.","Ask at least one person who is likely to disagree.","Post the decision and the advice you got, so others can see who was asked."],
    refs:["laloux2014","freeman1972","mcpherson2001","janis1982","lerner1999"]
  }
});
/* Entries, part 2: Counting */
Object.assign(FG.entries, {
  landsgemeinde:{
    actors:"everyone in the room · hands counted on the spot", scene:"useful",
    summary:"In a show of hands vote, everyone gathers in one place, hears the proposal and votes in the open by raising hands. The count is made on the spot, so everyone sees the result at once. It works for everyday questions where nothing private depends on how a person votes. It fails when people fear being seen voting against someone with power over them.",
    useful:{bullets:["Everyone affected can be in the room.","Nothing private or risky depends on how a person votes.","A quick, visible result matters more than a perfect count.","The question can be brought back if people change their minds."],
      title:"Students and staff vote on a school rule at their weekly meeting", where:"", text:"",
      why:"The rule affected everyone's daily life, nothing private was at stake, and the meeting happened every week. A quick, visible count let students see their vote decide something real, and anyone who lost could try again at a later meeting.",
      forces:[
        {f:"fair_process",e:"helps",gen:"People accept a result more readily when they can see every vote counted.",how:"Students saw the hands go up and the count made in front of them, so no one doubted the result."},
        {f:"coordination",e:"helps",gen:"When everyone sees the result at the same moment, there is no doubt about what was decided.",how:"Students and staff left the meeting knowing the new rule, so it took effect without a further announcement."}],
      together:""},
    risky:{bullets:["Someone with power over the voters is watching.","The vote is about a person, pay or anything private.","Hands go up in order, so early votes sway later ones.","The result is close and hard to count by eye."],
      title:"Teachers vote by show of hands on a new marking policy", where:"", text:"",
      why:"Voting in front of the head and senior colleagues made disagreement visible and risky. Teachers watched the front rows and followed them, so the count showed more support than there was. The policy passed easily and was then quietly ignored. A secret ballot would have shown the real doubts.",
      forces:[
        {f:"conformity",e:"hurts",gen:"When people vote in public, many follow the group.",how:"Teachers who disagreed raised their hands anyway, to avoid standing out in front of the head."},
        {f:"cascade",e:"hurts",gen:"When people vote one after another, early votes sway later ones.",how:"Hands near the front went up first, and others took them as a signal of where the room stood."}],
      together:""},
    tips:["Use it for everyday questions where nothing private is at stake.","Ask everyone to raise their hands at the same moment.","For people, pay or anything sensitive, use a secret ballot.","If the count is close, count again or switch to paper."],
    refs:["schaub2010","asch1956","bikh1992","ramchandani2025"]
  },
  supermajority:{
    actors:"a high bar · two-thirds to pass", scene:"useful",
    summary:"In supermajority voting, a proposal needs more than half the votes, often two-thirds, to pass. It protects against decisions that a large minority strongly opposes, and pushes supporters to win over doubters. It works for decisions that are costly or hard to undo. It fails when a minority uses the high bar to block what most people want, especially when delay causes harm.",
    useful:{bullets:["The decision is costly or hard to undo.", "It needs wide support to work in practice.", "Supporters have time to listen to doubters and change the plan.", "Waiting is safe if the vote fails."],
      title:"A school club of 12 chooses where to go on a field trip", where:"", text:"",
      why:"Everyone had to go on the trip and pay for it, so a 7 to 5 win would have left five students unhappy or at home. The higher bar made the majority ask why the others said no, and the new plan worked for nearly everyone.",
      forces:[
        {f:"influence_few",e:"helps",gen:"When a decision needs wide support, a slim majority cannot decide for everyone.",how:"Under a simple majority, seven students could have picked a trip five could not afford or enjoy. The higher bar meant they had to win over more of the club."},
        {f:"fair_process",e:"helps",gen:"People accept a result more readily when they can see their concerns taken up.",how:"The students who said no were heard and the plan changed, so even the one who still voted no could see how the choice was made."}],
      together:""},
    risky:{bullets:["A determined minority can block what most people want.", "The need is urgent and delay causes harm.", "Each failed vote costs time and money to rerun.", "The bar was set long ago and is hard to change."],
      title:"Voters decide whether to fund repairs to a crumbling school", where:"", text:"",
      why:"The bond needed two-thirds. 54% voted yes, so the minority won and the repairs waited while the building got worse. Reporters found that most failed school bonds in the state would have passed under majority rule.",
      forces:[
        {f:"influence_few",e:"hurts",gen:"When a minority can block a decision, a few voters can hold back what most people want.",how:"With a two-thirds bar, the 46% who voted no outweighed the 54% who voted yes."},
        {f:"fair_process",e:"hurts",gen:"When most people back something and it still fails, people lose faith in the process.",how:"Families who voted yes saw their majority overruled, and the district faced the cost of running the vote again."}],
      together:""},
    tips:["Use a high bar only for decisions that are costly or hard to undo.", "Before the vote, ask doubters what would win them over, and change the plan.", "Set out what happens if the vote fails, and when it can be tried again.", "Check whether the bar lets a small minority block urgent needs."],
    refs:["buchanan1962", "sunstein2002"]
  },
  unanimity:{
    actors:"12 on the panel · all must agree", scene:"risky",
    useful:{title:"Agreeing a safeguarding rule", where:"The staff of a small international primary school in Hanoi",
      text:"After a near miss on a school trip, the twelve staff must agree a rule on adult–child ratios for trips. The head says nothing will change unless everyone agrees. Over two meetings, the teachers who run the trips explain what works in practice. The final rule is stricter than anyone first proposed, and all twelve sign it.",
      why:"On a safety rule, everyone needs to follow it every time. Requiring all twelve to agree meant every concern was dealt with, and every person committed to the result.",
      forces:[
        {f:"independent",e:"helps",how:"Because any one person could block, each teacher's practical knowledge counted. The two teachers who lead trips most often could not be outvoted, and their experience shaped the rule."},
        {f:"coordination",e:"helps",how:"Once all twelve had signed, everyone could rely on everyone else following the rule on every trip. That shared expectation is what makes a safety rule work."}],
      together:"Requiring everyone's agreement brought each person's knowledge into the rule and made each person responsible for it. On a small team with a shared goal, that is worth the extra meeting."},
    risky:{title:"Agreement under pressure", where:"A university admissions panel in Brazil",
      text:"A panel of twelve must agree unanimously on the last scholarship place. Eleven favour one candidate. One panel member favours another and explains why. After two hours, the chair says the panel cannot leave until it agrees. Within twenty minutes the holdout changes her vote, saying she “didn't want to keep everyone”. Later she tells a colleague she still thinks the panel chose wrongly.",
      why:"Unanimity is meant to protect every voice, but under time pressure it can do the opposite. The person holding out carries the whole room's impatience.",
      forces:[
        {f:"conformity",e:"hurts",how:"Eleven people were waiting on one. The pressure to match the group grew with every minute, until changing her vote felt like the only reasonable thing to do."},
        {f:"spiral_silence",e:"hurts",how:"Others who had small doubts saw what happened to the one person who voiced hers. They kept theirs to themselves."},
        {f:"pluralistic_ignorance",e:"hurts",how:"The final vote looked unanimous, so the panel's record shows full agreement. At least one member, and possibly more, privately disagreed."}],
      together:"Unanimity made one person responsible for everyone's time. That turned disagreement into a social cost, so the dissenter gave way and others never spoke. The record says everyone agreed, which hides the doubt the rule was meant to bring out.",
      loop:{type:"R", nodes:["Time spent waiting on the holdout","Pressure on the holdout","Chance she gives way"], signs:["+","+","−"], note:"Each minute spent waiting raises the pressure on the holdout. When she gives way, the pressure is gone, but so is her view."}},
    tips:["Use unanimity for small groups with a shared goal and time to talk.","Never set a deadline that makes the holdout responsible for keeping everyone.","Record dissent, even after a unanimous vote."],
    refs:["buchanan1962","asch1956","prentice1993","ramchandani2019","ramchandani2025"]
  },
  liberum_veto:{
    actors:"a few members · any one can block", scene:"useful",
    summary:"Under a liberum veto, a decision needs every member's agreement, and any one member can stop it with a single no. No one has to explain the no or offer an alternative. It works for decisions that affect each member personally, where a no should not need reasons and costs little. It fails when a member blocks for unrelated reasons and nothing can change.",
    useful:{bullets:["The decision affects each member personally, such as their child's photo or data.","A member may have private reasons they should not have to explain.","There is a simple alternative, so a no costs little.","The group is small, so a no is rare and easy to respect."],
      title:"A school asks families before posting a class photo on its website", where:"", text:"",
      why:"Whether a child's picture goes online is a family's choice, and some families have reasons they should not have to explain. Giving each family a veto protected every child, and a no cost little: the school used a different picture.",
      forces:[
        {f:"influence_few",e:"helps",gen:"A veto stops a majority from deciding something that affects one person deeply.",how:"Five families could not outvote the one whose child the photo would affect."},
        {f:"fair_process",e:"helps",gen:"People trust a process that lets them say no without explaining.",how:"The family did not have to justify its no to anyone, so it could protect its child without being singled out."}],
      together:""},
    risky:{bullets:["Members have competing interests and can block for their own reasons.","Doing nothing causes harm.","No one has to give reasons or offer an alternative.","The group is large, so almost every proposal meets a no."],
      title:"A community school decides whether to accept a grant", where:"", text:"",
      why:"Most members wanted the money, and two opposed the testing that came with it. A veto let the two decide for everyone, with no need to explain or look for a middle way, such as accepting with conditions. Doing nothing won, and the school lost the grant.",
      forces:[
        {f:"influence_few",e:"hurts",gen:"When any one member can block, a few can decide for everyone.",how:"Two members out of nine stopped a grant the rest wanted."},
        {f:"polarization",e:"hurts",gen:"When a no needs no reasons, sides harden instead of looking for a middle way.",how:"With no need to discuss, neither side explored accepting the grant with conditions, and each vote hardened both camps."}],
      together:""},
    tips:["Use a veto for decisions that affect each member personally.","Limit it to a short list of essential issues.","Have a simple alternative ready for when someone says no.","Agree what happens if a veto lasts more than one or two rounds."],
    refs:["lukowski2010","buchanan1962"]
  },
  voting_rules:{
    actors:"ranked ballots · counted in rounds", scene:"useful",
    summary:"With ranked ballots, voters number the options in order of preference. If no option has more than half the first choices, the last option drops out and its ballots move to each voter's next choice, until one option has a majority. It works when several similar candidates would split the vote. It fails when the option most people could accept has few first choices and drops out early, or when few people understand the count.",
    useful:{bullets:["There are more than two candidates or options.","Similar candidates would otherwise split each other's votes.","You want the winner to have support from more than half the voters.","Voters can be shown how the count works before they vote."],
      title:"Students rank the candidates for student president", where:"", text:"",
      why:"With several candidates, past winners often had less than half the votes. Ranked ballots let students' later choices count once their first choice dropped out. The winner was not first on the most ballots at the start, but ended with just over half.",
      forces:[
        {f:"influence_few",e:"helps",gen:"When a winner needs more than half, a small loyal group can no longer decide alone.",how:"Under the old rules a candidate could win with a loyal minority. Now the winner needed backing from more than half of those who voted."},
        {f:"fair_process",e:"helps",gen:"People accept a result more readily when they can see their choice was counted.",how:"Each ballot kept counting through every round, so students whose first choice lost still helped decide the winner."}],
      together:""},
    risky:{bullets:["One option is most people's second choice but few people's first.","You want the option most people can accept, more than anyone's favourite.","There are only two options, so ranking adds nothing.","Voters, especially younger students, may find ranking and the count hard to follow."],
      title:"A student council picks one end-of-year event from three", where:"", text:"",
      why:"Ranked ballots drop the option with the fewest first choices, even when nearly everyone ranks it second. The picnic, the event most students could accept, went out first. A simpler ballot asking students to tick every event they would accept would have chosen it.",
      forces:[
        {f:"polarization",e:"hurts",gen:"When a group splits into two camps, an option in the middle can lose even though most people would accept it.",how:"The sports and talent show camps held most first choices between them, so the picnic in the middle went out in the first round."},
        {f:"fair_process",e:"hurts",gen:"People lose trust in a count when an option most of them could accept loses.",how:"Eight students got the event they ranked last, though an option they were happy with had been on the ballot."}],
      together:""},
    tips:["Agree on the counting rule, including how to treat incomplete ballots, before anyone votes.", "Show voters a worked example of the count.", "Publish the ballot data so anyone can check the result.", "If you want the option most people can accept, ask voters to tick every option they would accept."],
    refs:["arrow1951", "saari2001"]
  },
  gram_sabha:{
    actors:"everyone affected · agreed in the open", scene:"useful",
    summary:"In an open assembly, everyone affected meets at regular intervals, with a chair and someone to keep the minutes. The meeting hears what was done since last time, discusses needs and agrees plans together, often showing agreement with raised hands that no one needs to count. Gram sabha means village assembly. It works for shared, local decisions when enough people come and every group can speak. It fails when few attend, when a few powerful people do the talking, or when the matter involves private facts about individuals.",
    useful:{bullets:["The decision is about a shared place or budget that everyone uses.", "Everyone affected can get to the meeting, and it happens regularly.", "Those in charge report back on what was done since the last meeting.", "Real money or power follows what the assembly agrees."],
      title:"A department meets openly to decide where to cut its budget", where:"", text:"",
      why:"Everyone saw the same figures and heard each other's reasons, so the cut did not look like a deal made behind closed doors. Teachers who lost what they wanted could see why, and agreed to the final plan. Because the room agreed, the head carried it out with the department behind her.",
      forces:[
        {f:"shared_info",e:"helps",gen:"When everyone sees the same facts, the argument stays on the choices.",how:"Every teacher saw the full budget and the cost of each option, so no one suspected a hidden deal."},
        {f:"fair_process",e:"helps",gen:"People accept a loss more readily when they had a say and heard the reasons.",how:"Teachers whose plans were cut had argued for them in the room and then agreed to the final plan, so they accepted the result."}],
      together:""},
    risky:{bullets:["Few of those affected attend, or meetings suit some groups more than others.", "A few powerful people do most of the talking.", "The matter involves facts about individuals that must stay private.", "The group is too large or spread out to meet in one place."],
      title:"Students and staff hold an open meeting on a bullying concern", where:"", text:"",
      why:"The meeting needed facts about particular students, and those could not be shared in the open. People filled the gap with rumour, students were named in front of everyone, and the rule they agreed did not fit what had happened. Matters about individuals need a small, private group.",
      forces:[
        {f:"shared_info",e:"hurts",gen:"When key facts cannot be shared, a group decides on guesswork.",how:"Staff knew what had happened but could not say, so the room argued from rumour."},
        {f:"spiral_silence",e:"hurts",gen:"When speaking up feels risky, people keep quiet and the group hears less.",how:"Students who had been hurt would not speak in front of the whole school, so the room heard least from those who knew most."}],
      together:""},
    tips:["Hold meetings at times and places that everyone affected can reach.", "Put specific decisions on the agenda, with the facts people need.", "Take matters about individual people to a small, private group.", "Start each meeting by reporting what was done since the last one."],
    refs:["ramchandani2025"]
  },
  holacracy:{
    actors:"1 proposer · 1 facilitator · 5 in the circle", scene:"useful",
    useful:{title:"A new role for parent communication", where:"The operations circle of a private school in Amsterdam",
      text:"A teacher proposes a new role: one person in charge of all messages to parents, so families stop getting three emails about the same trip. The facilitator runs the set steps: the proposer explains, people ask questions, each person reacts once, the proposer adjusts, then each person is asked for objections. The admissions officer objects that admissions letters must stay with her team. The role is amended to exclude them, and it is adopted in 25 minutes.",
      why:"The script kept the meeting to the point. Questions, reactions and objections each had their own turn, so the one real problem surfaced and was fixed without a long debate.",
      forces:[
        {f:"conformity",e:"helps",how:"Each person reacted once, in turn, and no one could reply to another's reaction. There was no back-and-forth for people to drift into, so each reaction stayed their own."},
        {f:"pluralistic_ignorance",e:"helps",how:"Each person was asked directly whether they had an objection. No one had to guess what the others thought, so silence couldn't be mistaken for agreement."}],
      together:"The script took status out of the conversation. Fixed turns meant people didn't follow the loudest voice, and the facilitator held everyone to the same rules. The objection that mattered surfaced and was dealt with, and nothing else slowed the decision."},
    risky:{title:"The rules became the work", where:"A software company's education team in Bangalore",
      text:"The team adopts the full set of rules for every decision. Meetings fill with arguments about whether a concern counts as a valid objection, and which circle holds which role. Teachers who design the courses spend more time in governance meetings than with schools. Several newer staff say they don't understand the rules well enough to object. A year later the team drops the system.",
      why:"The method only helps if people can use it easily. Here the rules became something only a few people understood, and the time spent on them crowded out the actual work.",
      forces:[
        {f:"influence_few",e:"hurts",how:"The few people who knew the rules well could decide what counted as a valid objection. Knowing the process became a source of power."},
        {f:"spiral_silence",e:"hurts",how:"Newer staff weren't sure their concern would count. Rather than risk getting the process wrong in front of others, they said nothing."}],
      together:"Complex rules put power in the hands of the people who understood them, and others stopped taking part rather than risk getting the process wrong. A method designed to spread authority ended up concentrating it.",
      loop:{type:"R", nodes:["Complexity of the rules","Power of those who know them","Participation by everyone else"], signs:["+","−","−"], note:"Two negative links make this reinforcing: as fewer people take part, the experts write more rules, which makes it harder still to join in."}},
    tips:["Start with one meeting format, not the whole system.","Train everyone, including students or parents who join, before they are in the circle.","Check every few months whether the meetings are helping the work or replacing it."],
    refs:["robertson2015","bernstein2016","ramchandani2019"]
  },
  lazy_consensus:{
    actors:"1 proposer · 9 on the list · 5 days", scene:"useful",
    useful:{title:"Updating the reading list", where:"The English department of a secondary school in Auckland",
      text:"A teacher posts in the department channel: “I plan to swap one Year 10 novel for a newer one by a Pacific author. If no one objects by Friday, I'll order it.” Two colleagues reply with a thumbs up. No one objects. On Monday she orders the books. The department meeting, normally 45 minutes of small decisions, takes 15.",
      why:"Most decisions are small and most people agree. Lazy consensus lets those go ahead without a meeting, while anyone who disagrees still has a clear chance to say so.",
      forces:[
        {f:"coordination",e:"helps",how:"Everyone knew the rule: silence by Friday means yes. No one had to guess whether they needed to reply, so the decision was clear."},
        {f:"independent",e:"helps",how:"Each teacher read the proposal on their own time and could object in writing. No one was swayed by a room full of colleagues nodding."}],
      together:"A clear deadline and a known rule let small decisions go through quickly. Because each person read and judged the proposal alone, the silence was more likely to mean agreement. The time saved went into the decisions that did need a meeting."},
    risky:{title:"Silence during exam week", where:"A teachers' committee at a public university in Ghana",
      text:"The committee chair posts a proposal to cut practical lab hours in first-year chemistry, with five days for objections. It goes out in the middle of marking week. Most lecturers don't read it. No one objects, and the change goes ahead. When teaching starts, three lecturers say they would have objected strongly, but they never saw the message.",
      why:"Lazy consensus treats silence as agreement. That only works if people have a real chance to see and respond. Here the timing meant silence meant nothing.",
      forces:[
        {f:"pluralistic_ignorance",e:"hurts",how:"The absence of objections looked like agreement. The chair assumed everyone was content, when most people simply hadn't read the proposal."},
        {f:"influence_few",e:"hurts",how:"The chair chose the timing and the deadline. A short window in a busy week gave the proposer a strong advantage over everyone else."}],
      together:"The rule counted silence as consent, and the timing made silence almost certain. The proposer controlled both, so a significant change passed without real agreement. The problem only came to light when it was too late to change easily."},
    tips:["Use it for small, reversible decisions.","Avoid busy weeks, and make the deadline long enough for people to actually read.","For anything significant, ask for an explicit yes."],
    refs:["fogel2005","prentice1993"]
  },
  rough_consensus:{
    actors:"a chair judges concerns · or silence by a deadline", scene:"useful",
    summary:"Rough or lazy consensus reaches agreement without everyone's active yes. In rough consensus, a chair judges when every concern has been answered, even if some people still prefer another option. In lazy consensus, a proposal goes ahead if no one objects by a deadline. Both save time on decisions most people already agree with. They fail when the chair's judgement is biased, or when the silence comes from people who never saw the proposal.",
    useful:{bullets:["Most people already broadly agree.","The decision is a variation on something already worked through together.","A trusted chair can judge when concerns have been answered.","Everyone knows a concern counts, however few people raise it."],
      title:"A student–teacher council adds one change to its homework policy", where:"", text:"",
      why:"The main policy had already been argued through over a term, so this was a variation, not a new fight. The co-chairs asked whether every concern had been answered, not how many people agreed. Two teachers' practical point moved the coursework deadlines, they said they could live with the result, and the council agreed without a vote.",
      forces:[
        {f:"local_knowledge",e:"helps",gen:"The people closest to the work know details the rest of the group cannot see.",how:"Only the Year 11 teachers knew their coursework deadlines fell in the exam weeks. Because the chairs asked for concerns, that detail changed the plan before it took effect."},
        {f:"fair_process",e:"helps",gen:"People accept a decision more readily when their concern was heard and answered.",how:"The two Year 11 teachers saw their concern change the plan, so they could live with the result even though it was not their first choice."}],
      together:""},
    risky:{bullets:["The chair wants to finish quickly.","A concern comes from someone with less status, such as a student.","No one checks that each concern has been answered.","The person raising it is the only one."],
      title:"A chair declares rough consensus on blazers before a student's concern is answered", where:"", text:"",
      why:"Rough consensus depends on the chair answering every concern, not counting support. The chair took broad agreement as enough and moved on. The student's concern about hot classrooms was never answered, and in June it came back as a wave of complaints, so the rule had to be rewritten mid-term.",
      forces:[
        {f:"influence_few",e:"hurts",gen:"When one person judges whether consensus has been reached, their judgment decides.",how:"The chair alone decided the discussion was over. The concern stayed open because she said it was settled."},
        {f:"spiral_silence",e:"hurts",gen:"A lone dissenter who is moved past stops pressing the point.",how:"With every adult and most students agreeing, the student did not raise the concern again."}],
      together:""},
    tips:["Say clearly how agreement will be judged: by a chair, or by silence by a date.","Send proposals when people have time to read them.","Ask directly for concerns, not for votes.","Record who raised concerns and how each was answered."],
    refs:["resnick2014"]
  },
  consensus_fallback:{
    actors:"aim for consensus · vote if time runs out", scene:"useful",
    summary:"In consensus with a fallback, the group works toward consensus, but agrees in advance that if it cannot agree by a set point, it will switch to a vote, often needing two-thirds. The fallback stops one or two people from blocking forever, while the discussion still has to answer concerns. It fails when the deadline comes too soon, or when the larger side waits out the discussion knowing it will win the vote.",
    useful:{bullets:["Consensus is worth trying, but the decision cannot wait forever.","The fallback rule and deadline are agreed before discussion starts.","The fallback vote has a high bar, such as two-thirds.","People will keep talking in good faith until the deadline."],
      title:"A leadership team chooses next year's timetable model", where:"", text:"",
      why:"Two meetings of discussion answered most concerns and improved the plan. When one member still could not agree, the agreed fallback, a two-thirds vote, settled it. The member accepted the result because the rule had been agreed before the discussion began.",
      forces:[
        {f:"fair_process",e:"helps",gen:"People accept a fallback they agreed to before the discussion began.",how:"Everyone had agreed the deadline and the two-thirds rule in advance, so no one disputed the vote."},
        {f:"influence_few",e:"helps",gen:"A fallback stops one person from blocking indefinitely.",how:"The one member who still objected could not hold up the timetable for the rest of the year."}],
      together:""},
    risky:{bullets:["Everyone must carry out the decision for it to work, as with a safety rule.","The deadline is too short for real discussion.","The larger side knows it will win the vote.","Concerns are heard but not answered."],
      title:"Club heads can't agree a late pick-up safety rule in one meeting, so they fall back on a vote", where:"", text:"",
      why:"A safety rule only works if every club follows it, so this needed everyone's agreement, through consensus or consent. The fallback vote produced a decision but not commitment: the three heads who were outvoted never agreed to the rule, and didn't carry it out.",
      forces:[
        {f:"coordination",e:"hurts",st:"ignored",gen:"A rule works when everyone can count on everyone else following it.",how:"With three clubs not following the rule, no one could count on it, so students' pick-up depended on which club they were in."},
        {f:"fair_process",e:"hurts",st:"ignored",gen:"People who are outvoted without their concerns answered are less likely to carry out the decision.",how:"The three heads' concern about clubs ending after dark was noted but never answered, so they didn't see the rule as theirs."}],
      together:""},
    tips:["Agree on the fallback and the deadline before discussion starts.","Allow enough time for concerns to be answered.","Use a high bar, such as two-thirds, for the fallback vote.","Before voting, list each concern and how it was answered."],
    refs:["sunstein2002"]
  },
  consensus_discussion:{
    actors:"a small group · all must support", scene:"useful",
    summary:"In unanimous consensus with discussion, the group talks until everyone can support one decision. Anyone who objects explains why and helps find another option, so the final plan answers every concern. It works for small groups with a shared goal and time to talk. It fails when meetings drag on, people with less time drop out, and one or two can block with no fallback.",
    useful:{bullets:["The group is small and shares a goal.","Everyone's support is needed for the decision to work.","There is time to talk until a plan suits everyone.","People who object will explain why and help look for options."],
      title:"Four teachers who share a class agree changes to its routine", where:"", text:"",
      why:"Each teacher's students depended on the shared routine, so a change that suited three could quietly harm the fourth. Because all four had to support it, her concern was heard, and the team kept talking until they found a slot that worked for every group.",
      forces:[
        {f:"local_knowledge",e:"helps",gen:"The person closest to a problem often sees what others miss.",how:"Only the fourth teacher knew her Monday group would miss the test. Her objection brought that into the decision."},
        {f:"fair_process",e:"helps",gen:"People commit to a decision they helped shape.",how:"All four had shaped the final slot, so each kept to it."}],
      together:""},
    risky:{bullets:["There is a deadline, and doing nothing has a cost.","The options are all reasonable, so people have preferences, not strong objections.","Each person has already invested in their own option.","Anyone can block, and there is no other way to move forward."],
      title:"A team of six students can't agree which idea to enter in a competition", where:"", text:"",
      why:"Even in a group of six, waiting for everyone to back one idea stalled the team, because each pair preferred its own and none of the ideas was unsafe. Sociocratic consent would have asked a different question: can everyone live with trying this idea? Objections would then have reshaped one plan instead of keeping three alive until the deadline.",
      forces:[
        {f:"polarization",e:"hurts",st:"hurt",gen:"When the same sides meet again and again, positions harden.",how:"Each meeting repeated the same case for each idea, and each pair grew more certain of its own."},
        {f:"commitment",e:"hurts",st:"hurt",gen:"Once people have invested in an option, giving it up feels like a loss.",how:"Each pair had already spent hours on its idea, so backing another felt like throwing that work away."}],
      together:""},
    tips:["Set a deadline and a fallback, such as a supermajority vote if consensus fails.","Ask anyone who objects to explain why and suggest a change.","Hold meetings at times everyone can make, and keep them short.","Keep consensus for small groups with a shared goal."],
    refs:["mansbridge1980","freeman1972","ramchandani2019"]
  },
  indaba:{
    actors:"a few at the centre · everyone else listening", scene:"useful",
    summary:"In an indaba, a small group sits at the centre and talks while everyone else listens and passes in notes. Each person says what they need, and anyone who rejects an idea must offer another in its place. The aim is a solution everyone can live with. It works when the people in the centre come to listen and change their minds. It fails when they come to read out set positions.",
    useful:{bullets:["There are too many people for one real conversation.","Everyone needs to see how the decision was reached.","The people in the centre represent the main groups affected.","People are willing to change their minds."],
      title:"A school holds a fishbowl discussion on phones", where:"", text:"",
      why:"A small circle could hold a real conversation while everyone else listened. The rule that every no comes with an idea kept the discussion moving toward a solution, and because everyone watched it happen, the wider group accepted the result.",
      forces:[
        {f:"polarization",e:"helps",gen:"When every objection must come with an alternative, sides cannot simply oppose each other.",how:"Students, teachers and parents in the circle had to offer ideas, so the talk moved toward a plan instead of hardening."},
        {f:"shared_info",e:"helps",gen:"When everyone hears the same conversation, the result is easier to accept.",how:"The listeners heard how the plan was reached, so it needed little explaining afterwards."}],
      together:""},
    risky:{bullets:["The people in the centre speak for organisations with fixed positions.","No one responds to what others say.","The outcome is worded so each side can read its own view into it.","Listeners have no way to feed in."],
      title:"An education ministry holds a summit on a new curriculum framework", where:"", text:"",
      why:"The people in the centre came to speak for their organisations, so the circle became a stage for set positions. No one responded to anyone else, and the joint statement was so vague that each side read it as support for its own view.",
      forces:[
        {f:"polarization",e:"hurts",gen:"When people come to defend fixed positions, they talk past each other.",how:"Union leaders and officials read prepared statements, and no one changed their view."},
        {f:"pluralistic_ignorance",e:"hurts",gen:"A vague agreement lets each side believe the others agree with them.",how:"Each side read the joint statement as support for its own view, so the disagreement stayed hidden."}],
      together:""},
    tips:["Choose people for the centre who can speak for their group and still change their minds.","Hold to the rule: every no comes with another idea.","Let listeners pass notes in.","Write down what was agreed in plain words everyone reads the same way."],
    refs:["redmond2011","sunstein2002"]
  },
  kleroterion:{
    actors:"60 eligible · 5 drawn", scene:"useful",
    useful:{title:"A student panel drawn by lot", where:"A large public secondary school in Athens",
      text:"The school wants student views on a new behaviour policy. Rather than ask the student council, which is mostly the same confident students every year, it draws five students at random from each year group. The drawn students meet four times with a teacher who explains the options. Several have never been asked their opinion before. Their recommendations, including a quiet room as an alternative to detention, go into the final policy.",
      why:"A lottery reached students who would never volunteer or be elected. Their views were different from the usual voices, and the policy was better for it.",
      forces:[
        {f:"influence_few",e:"helps",how:"The student council is usually led by a few confident students. Drawing names by lot gave quieter students the same chance to be heard."},
        {f:"network_shape",e:"helps",how:"Elected councils tend to draw from popular friendship groups. A lottery reached students outside those networks, including some who rarely speak in class."}],
      together:"The lottery broke the link between being popular and being heard. Students outside the usual networks brought views the school had not heard before, and because no one could predict who would be drawn, no group could arrange the outcome."},
    risky:{title:"Drawn, but not supported", where:"A district parents' council in Colombia",
      text:"The district draws parent representatives by lottery for one-year terms. Meetings are held at 2 pm on weekdays, there is no training, and the papers arrive the night before. Most drawn parents attend once or twice, then stop. The district's education officer, who prepares every paper, ends up shaping every decision. The lottery is meant to share power, but in practice it has moved it to the official.",
      why:"Random selection only spreads power if the people chosen can actually take part. Without time, training or information, they couldn't, so power moved to the person who could.",
      forces:[
        {f:"influence_few",e:"hurts",how:"The education officer prepared every paper and attended every meeting. With drawn parents dropping out, she became the one fixed voice in the room."},
        {f:"shared_info",e:"hurts",how:"The officer had all the background, and the parents had a pile of papers the night before. Everyone was working from her summary of the facts."}],
      together:"The lottery chose ordinary parents, but nothing helped them take part. As they dropped away, the official who controlled the information became the one person who really decided. The structure looked open and acted closed.",
      loop:{type:"R", nodes:["Support for drawn members","Members who keep coming","Reliance on the official"], signs:["+","−","−"], note:"Little support means fewer members keep coming, which means more reliance on the official, which means even less reason to support members."}},
    tips:["Pay or support people for their time, and hold meetings when they can come.","Give drawn members training and papers in good time.","Check who prepares the information, because that person shapes the decision."],
    refs:["hansen1991","farrell2019"]
  },
  venice:{
    actors:"30 candidates · alternating draws and votes", scene:"useful",
    useful:{title:"Electing a student union president", where:"A university with strong student factions in Lima",
      text:"Two student factions have won every union election for a decade, and each accuses the other of buying votes. The union adopts a new process. A random draw picks 30 members; they vote to choose 10; a second draw cuts those to 5; the 5 nominate candidates, and the full membership votes, needing 60% to win. No faction can predict who will be in each round. The winner, from neither faction, gets 64%.",
      why:"The mix of draws and votes made it hard for any faction to control the outcome, while still letting popular candidates rise. It is complicated, but it broke a decade of capture.",
      forces:[
        {f:"influence_few",e:"helps",how:"Each random draw meant a faction couldn't know whom to pressure. Buying votes stopped being worth it, because the people to buy changed at every stage."},
        {f:"polarization",e:"helps",how:"The final vote needed 60%, so no faction could win alone. Candidates had to appeal across the divide."}],
      together:"The random draws removed the payoff from organising factions, and the high final threshold rewarded candidates who could unite people. Each part covers a weakness in the other: lottery alone ignores who people want, and voting alone can be captured.",
      loop:{type:"B", nodes:["A faction's effort to control the vote","Uncertainty about who is in each round","Payoff from that effort"], signs:["+","+","−"], note:"The more a faction tries to control things, the more the random draws work against it, which keeps capture in check."}},
    risky:{title:"Too clever to trust", where:"A national network of education NGOs in Italy",
      text:"The network uses a multi-round process of random draws and votes to choose its chair. Few member organisations understand it. When a little-known candidate from a small NGO wins, rumours spread that the draws were fixed. The network can't easily show otherwise, because the process has so many steps. Several large members stop paying their fees the next year.",
      why:"A process people can't follow is hard to trust, however fair it is. Here suspicion about the method cost the network its legitimacy and part of its funding.",
      forces:[
        {f:"shared_info",e:"hurts",how:"Members didn't share a clear picture of how the result was reached. Rumours filled the gap faster than explanations could."},
        {f:"cascade",e:"hurts",how:"Once a few well-known NGO directors questioned the result, others repeated the doubt without checking it. Each repetition made the rumour seem more credible."}],
      together:"Because few members understood the process, a surprising result had no ready explanation. Doubt spread through the network as directors repeated what others said, and the complexity that protected the vote also made it hard to defend.",
      loop:{type:"R", nodes:["Members repeating the doubt","How credible the rumour seems","Members who believe it"], signs:["+","+","+"], note:"A reinforcing loop: each person repeating the doubt makes it seem more credible, which leads more people to repeat it."}},
    tips:["Explain each step with a practice run before the real election.","Draw lots in public, with observers from every side.","Keep it for situations where capture is a real risk; it is slow."],
    refs:["mowbray2007","bikh1992"]
  }
});
/* Entries, part 5: Structured deliberation */
Object.assign(FG.entries, {
  delphi:{
    actors:"8 experts · 3 anonymous rounds", scene:"useful",
    useful:{title:"How many Year 7 places next year?", where:"A school trust's planning team in Manchester",
      text:"The trust must decide how many Year 7 places to offer. Eight people with different knowledge (admissions staff, two heads, a council planner, a data analyst) each send a forecast and a short reason, without names. A coordinator shares the range of answers and the reasons. Each person then revises. After three rounds the forecasts are close together, and the trust plans for 410 places. The actual intake is 404.",
      why:"Keeping answers anonymous stopped the senior heads from setting the number. Seeing others' reasons, not just their numbers, let people improve their own estimates.",
      forces:[
        {f:"independent",e:"helps",how:"Each expert made a first forecast alone. Their errors pointed in different directions, so the group's starting average was already reasonable."},
        {f:"conformity",e:"helps",how:"No one knew which forecast came from the senior heads, so there was no one to defer to. A good reason from the data analyst carried as much weight as one from a head."},
        {f:"network_shape",e:"helps",how:"Everyone saw everyone's reasons through the coordinator, rather than talking to the people they already knew. Information spread evenly across the group."}],
      together:"Anonymity removed status, independent first answers kept the errors from lining up, and sharing reasons through one coordinator spread information evenly. Each round improved the forecasts without letting any one voice take over.",
      loop:{type:"B", nodes:["Spread between forecasts","Reasons shared in the next round","Revisions towards better-supported numbers"], signs:["+","+","−"], note:"Each round narrows the spread, as people revise in light of others' reasons."}},
    risky:{title:"Converging on the wrong answer", where:"A teacher-training NGO planning its next three years in Indonesia",
      text:"The NGO uses three Delphi rounds to forecast how many maths teachers its rural partner schools will need trained. Most of the panel are university professors and the NGO's own senior staff. In round two, the summary highlights the median forecast. By round three, nearly everyone has moved towards it. The NGO plans for a small shortage. Two years later the gap is three times larger, as many rural teachers had already left, which the panel had not known.",
      why:"The rounds produced agreement, but agreement isn't accuracy. The panel lacked people who knew the rural schools, and highlighting the median pulled everyone towards it.",
      forces:[
        {f:"conformity",e:"hurts",how:"Seeing the median, panel members moved towards it, even without a new reason to. The rounds measured how much people wanted to agree as well as what they knew."},
        {f:"shared_info",e:"hurts",how:"Most panel members drew on the same national data and the same research. Their errors lined up instead of cancelling, so agreement looked stronger than the evidence."},
        {f:"groupthink",e:"hurts",how:"Most panel members knew and respected each other's work. Questioning the group's shared picture felt like questioning colleagues, so no one did."}],
      together:"A panel with similar backgrounds started with errors that pointed the same way, and the median in each summary pulled everyone closer together. No head teacher from a rural partner school was on the panel to say otherwise. The rounds produced a confident forecast that was wrong in a way the panel couldn't see.",
      model:{type:"fishbone", effect:"A confident forecast that was badly wrong", bones:[
        ["Who was on the panel",["Professors and senior staff","No rural head teachers"]],
        ["Information",["Same national data","No field reports"]],
        ["Summary",["Median highlighted","Reasons shortened"]],
        ["Incentive",["Rounds read as a push to agree"]]],
        note:"Delphi improves forecasts when the panel's knowledge is varied. When it isn't, the rounds can sharpen a shared mistake."}},
    tips:["Pick panel members with different kinds of knowledge, including people close to the ground.","Share reasons, not just the median.","Treat agreement as a result to check, not proof of accuracy."],
    refs:["dalkey1963","rowe1999","lorenz2011"]
  },
  ngt:{
    actors:"10 in the room · write, share, rank", scene:"useful",
    useful:{title:"What should the new wellbeing budget fund?", where:"A staff meeting at a secondary school in Glasgow",
      text:"The head asks 30 staff to spend ten minutes writing down, alone, what the wellbeing budget should fund. Then each person shares one idea at a time, going round the room, with no discussion. A facilitator lists every idea on the board. After a short time to ask what ideas mean, each person ranks their top five on paper. The top three are funded. A support worker's idea, a quiet lunchtime space, comes second.",
      why:"Writing alone first meant quieter staff had their ideas ready before the confident voices spoke. Ranking privately meant no one could see how others were voting.",
      forces:[
        {f:"independent",e:"helps",how:"Ten minutes of silent writing meant every idea came from one person's own thinking. The list on the board was much wider than an open discussion would have produced."},
        {f:"conformity",e:"helps",how:"Ranking was private and on paper. Staff could rank the support worker's idea highly without being seen to go against senior colleagues."}],
      together:"Silent writing protected each person's ideas, round-robin sharing gave them equal airtime, and private ranking let people choose without social pressure. Each step protected a different part of the process, so a good idea from a junior colleague made it through."},
    risky:{title:"A list without a conversation", where:"A university department in Canada",
      text:"The department uses nominal group technique to decide how to cut its budget by 10%. The steps work smoothly, and the top-ranked idea is to stop running a small first-year writing course. No one had discussed what the course did. After it closes, students who struggled with academic writing have nowhere to go, and failure rates rise in second year.",
      why:"The method collects and ranks ideas well, but it keeps discussion short. On a complex question with hidden effects, the group needed a conversation about consequences.",
      forces:[
        {f:"shared_info",e:"hurts",how:"Each person ranked ideas based on what they already knew. Few knew what the writing course did for struggling students, and there was no discussion to share it."},
        {f:"independent",e:"hurts",how:"Independent judgments only help if people have the knowledge to judge. Here most people's independent guesses about the course were wrong in the same way."}],
      together:"Private ranking protected people from each other's influence, but it also kept them from learning from each other. Most people lacked the same piece of information, and the method gave no chance to fill the gap.",
      loop:{type:"R", nodes:["Courses cut without discussion","Students who struggle without support","Pressure on the remaining budget"], signs:["+","+","+"], note:"Cutting support without discussing its effects can create new costs that lead to more cuts."}},
    tips:["Use it for generating and choosing among ideas, not for weighing complex trade-offs.","Add a short round on consequences before ranking.","Invite someone who knows the area well when the stakes are high."],
    refs:["delbecq1971","surowiecki2004"]
  },
  participatory_budgeting:{
    actors:"40 students propose · 600 vote", scene:"useful",
    useful:{title:"Students decide part of the budget", where:"A public high school in Phoenix, Arizona",
      text:"The principal sets aside part of the school's discretionary budget for students to allocate. Students form a steering committee, collect ideas from classmates, and turn them into costed proposals with help from staff. Proposals include water bottle refill stations and more library hours. Every student can vote by secret ballot. The winning projects are built the following term, and many students say they now understand how school decisions are made.",
      why:"Students saw real money spent on what they chose. The process taught them about budgets and about each other's needs, as well as funding the projects.",
      forces:[
        {f:"influence_few",e:"helps",how:"Any student could propose, and every student had one vote. Ideas from students who are rarely heard reached the ballot on equal terms."},
        {f:"shared_info",e:"helps",how:"Turning ideas into costed proposals meant every voter saw the same facts: what each project would cost and what it would do."}],
      together:"Open proposals and equal votes spread influence across the student body, and costed proposals gave everyone the same information to vote on. Because the projects were actually built, students had a reason to trust the next round.",
      loop:{type:"R", nodes:["Projects actually built","Students' trust in the process","Students who take part next year"], signs:["+","+","+"], note:"When projects get built, trust and participation grow. This reinforcing loop only holds if the school keeps its promise."}},
    risky:{title:"Only the organised won", where:"A city schools budget process in Brazil",
      text:"A city lets residents vote on part of the school maintenance budget. Neighbourhood associations in better-off districts organise quickly, bring people by bus to the assemblies, and win most of the money. Schools in the poorest districts, where parents work long hours and few associations exist, get little. The process is open to all, but the results follow organisation, not need.",
      why:"Participatory budgeting rewards the groups best able to turn out. Without rules that weight need, it can send money to places that already have more.",
      forces:[
        {f:"network_shape",e:"hurts",how:"Strong neighbourhood associations could reach many people quickly. Districts without them had no network to bring people to the vote."},
        {f:"cumulative",e:"hurts",how:"Districts that won money one year were better organised the next. Each win made the next win more likely."}],
      together:"Open participation meant the best-networked districts could turn out the most votes, and each year's wins strengthened their organisation for the next. Without a rule that weights need, the process steadily moved money towards the districts that already had more.",
      loop:{type:"R", nodes:["Money won by a district","Strength of its associations","Turnout at the next vote"], signs:["+","+","+"], note:"A reinforcing loop: winning builds organisation, which wins more. Brazilian cities that use this method often add rules that weight need to break it."}},
    tips:["Weight the budget by need, or reserve part of it for the least-served groups.","Hold assemblies at times and places that suit the people who rarely come.","Build the winning projects quickly, and say when they will be done."],
    refs:["cohen2015","wampler2007"]
  },
  polis:{
    actors:"300 take part · groups found by the software", scene:"useful",
    useful:{title:"Opinion mapping on school start times", where:"A city education department in Taiwan",
      text:"The department asks parents, students and teachers to react online to short statements about later start times. People agree, disagree or pass, and can add their own statements. The software groups people by how they vote and shows the statements that every group agrees with. Most groups agree that sleep matters and that bus timing is the real obstacle. The department focuses on bus contracts. Taiwan's vTaiwan process, which Audrey Tang helped build, used Polis in a similar way to draft ride-hailing rules.",
      why:"Instead of measuring who was for or against, the process found what different groups had in common. That gave the department a place to start.",
      forces:[
        {f:"polarization",e:"helps",how:"People never replied to each other directly, so there were no arguments to escalate. The software looked for statements that people in every group agreed with, and those rose to the top."},
        {f:"spiral_silence",e:"helps",how:"People could disagree with a statement privately, with one click. Views that would rarely be said aloud at a public meeting still showed up on the map."}],
      together:"Removing replies took the heat out of the debate, and equal weight for every voter limited organised groups. The software then showed what people agreed on across the divide, which gave the department something to act on.",
      model:{type:"cla", layers:[
        ["The headline","“Parents split on later start times.”"],
        ["The causes","Bus contracts, after-school jobs, sport schedules."],
        ["The worldviews","Some see school as preparing for work hours; others as protecting young people's health."],
        ["The deeper stories","“Hard work starts early” set against “tired children can't learn.”"]],
        note:"Opinion mapping works at the top two layers. It found shared ground on the causes, even though the deeper stories still differ."}},
    risky:{title:"A map the funder never used", where:"An NGO's after-school programme in Nairobi, funded from abroad",
      text:"The NGO runs an online opinion map with 800 parents and older students about what its after-school clubs should offer. The map finds broad agreement on homework help and football, with less interest in the coding club. The programme's international funder, which never said what it would do with the results, renews the grant only for coding. Parent turnout at the next consultation falls by more than half.",
      why:"The tool found agreement, but no one had committed to act on it. Parents and students who took part saw their time wasted.",
      forces:[
        {f:"influence_few",e:"hurts",how:"The funder kept the real decision. The consultation ran alongside it with no link to it, so families' views had no route to the money."},
        {f:"cascade",e:"hurts",how:"Once parents heard the results had been ignored, word spread quickly at the school gate. Each person who said “it's pointless” made the next person more likely to agree."}],
      together:"Without a promise from the funder to act on the results, the consultation had no power, and news that it had been ignored spread quickly among families. The tool did what it was meant to do, but nothing tied its results to the decision that mattered.",
      loop:{type:"R", nodes:["Results ignored","Belief that taking part is pointless","People taking part next time"], signs:["+","+","−"], note:"Each ignored consultation weakens the next one."}},
    tips:["Say in advance how the results will be used, and by when.","Seed the conversation with statements from all sides.","Report back on what was done with the areas of agreement."],
    refs:["small2021","weyl2024"]
  }
});
/* Entries, part 6: Weighted and delegated votes */
Object.assign(FG.entries, {
  dao_token:{
    actors:"votes count by size · a few can hold most of the weight", scene:"useful",
    summary:"In weighted voting, each vote counts for more or less depending on what the voter holds or represents, such as pupils in a school, shares in a company or tokens in an online group. It gives more say to those with more at stake. It works when weights match how much each voter is affected and everyone accepts them. It fails when one or two large voters can decide everything and the rest stop taking part.",
    useful:{bullets:["Voters are affected by very different amounts.","The weights are agreed in advance and are public.","No single voter holds more than half the weight.","Everyone still has some say."],
      title:"Five schools in a network vote on shared bus routes", where:"", text:"",
      why:"Most of the pupils affected were at the largest school, so giving its vote more weight matched the decision to the people it touched. Each small school still had a vote, and the weights had been agreed in advance, so the result was accepted.",
      forces:[
        {f:"fair_process",e:"helps",gen:"People accept weights they agreed to in advance.",how:"The schools had agreed the weights when they formed the network, so no one disputed the count."},
        {f:"shared_info",e:"helps",gen:"When weights and votes are public, anyone can check the result.",how:"Every school could see each weight and each vote, so the count was easy to follow."}],
      together:""},
    risky:{bullets:["One voter holds most of the weight.","Weights can be bought, so money becomes votes.","Small voters see they cannot change the result.","The weights were set long ago and no longer fit."],
      title:"Four schools share a budget, with votes weighted by pupils", where:"", text:"",
      why:"With more than half the weight, one school could win every vote alone. The count looked fair, but shared decisions became one school's decisions, and the small schools stopped taking part. A cap on any one member's weight would have kept the others at the table.",
      forces:[
        {f:"influence_few",e:"hurts",gen:"When one voter holds most of the weight, they decide for everyone.",how:"The large school's vote alone passed every proposal."},
        {f:"exit_voice",e:"hurts",gen:"When people see they cannot change the result, they leave instead of speaking up.",how:"The small schools stopped coming, so the board heard only from the large school."}],
      together:""},
    tips:["Agree on the weights in advance and make them public.","Cap any one voter's share, for example at a third.","Give every member a minimum vote, whatever their size.","Review the weights when numbers change."],
    refs:["fritsch2024","michels1915"]
  },
  liquid:{
    actors:"40 members · votes passed to trusted delegates", scene:"useful",
    useful:{title:"Teachers delegate by subject", where:"A national network of rural teachers in Mexico",
      text:"The network chooses which free resources to recommend each term. Members can vote on each subject themselves, or pass their vote on that subject to a colleague they trust. A primary teacher votes on reading herself but delegates science to a colleague who teaches it. She can take her vote back at any time. Most members vote on one or two subjects and delegate the rest. The recommendations are well regarded across the network.",
      why:"Delegation let people use their own judgment where they knew most and trust others where they didn't. Being able to take a vote back kept delegates accountable.",
      forces:[
        {f:"network_shape",e:"helps",how:"Members delegated to colleagues they knew and trusted in each subject. Votes flowed to people with real knowledge, through existing relationships."},
        {f:"independent",e:"helps",how:"Each member still voted directly where they felt confident. The final results mixed many direct judgments with delegated ones."}],
      together:"Delegating by subject sent votes along trusted links to people who knew the topic, while direct votes kept many independent judgments in the mix. Because any vote could be taken back, delegates had to keep earning trust.",
      loop:{type:"B", nodes:["Votes held by a delegate","Scrutiny of that delegate","Votes taken back"], signs:["+","+","−"], note:"A balancing loop: the more votes a delegate holds, the more closely people watch them, and the easier it is to take votes back."}},
    risky:{title:"The super-delegates", where:"A national students' union in Germany",
      text:"The union uses liquid democracy for policy votes. Within a year, a few well-known activists hold thousands of delegated votes each, passed on again and again. Most members never check where their vote ended up. On a vote about exam policy, three super-delegates decide the result, though most members whose votes they used had never heard their view on it.",
      why:"Delegation can concentrate power quickly, especially when votes are passed on again and people don't check. The few at the end of long chains decided for everyone.",
      forces:[
        {f:"cumulative",e:"hurts",how:"Popular delegates attracted more delegations, which made them more visible, which attracted more. A few people ended up holding most of the votes."},
        {f:"network_shape",e:"hurts",how:"Votes flowed towards the best-connected activists. Members far from that centre had their votes carried away along chains they couldn't see."}],
      together:"Popularity snowballed into vote share, and passing votes on again carried them to the best-connected people at the centre. Few members checked, so a system designed to spread power ended up concentrating it.",
      loop:{type:"R", nodes:["Votes held by a delegate","How visible they are","New delegations to them"], signs:["+","+","+"], note:"A reinforcing loop: visibility attracts votes, which brings more visibility. Studies of online parties using this method found a small number of super-voters."}},
    tips:["Show each member where their vote ended up after every decision.","Limit how many times a vote can be passed on.","Cap how many votes any one delegate can hold."],
    refs:["blum2016","kling2015"]
  },
  conviction:{
    actors:"support placed any time · builds up over time", scene:"useful",
    summary:"In conviction voting, people place their support on the proposals they want and can move it at any time. Support builds up the longer it stays, and a proposal passes once its built-up support crosses a threshold, which is higher for proposals that ask for more. It rewards lasting support over sudden swings. It works for questions that stay open for months while people learn. It fails when people stop updating their support, so old views keep counting.",
    useful:{bullets:["The question stays open for months while people learn.","You want lasting support, not a reaction to one event.","Proposals can come up at any time of year.","Someone can run software that tracks support over time."],
      title:"Teachers decide over time how students may use AI", where:"", text:"",
      why:"Teachers' views on AI kept changing as the tools changed. A one-off vote would have caught the mood of a single week. Conviction voting adopted a policy only once support had lasted, so a sudden swing after one news story did not decide it.",
      forces:[
        {f:"cascade",e:"helps",gen:"Requiring support to last slows down swings that spread from person to person.",how:"A wave of alarm after one news story spread through the staff room, but faded before it could build enough support."},
        {f:"independent",e:"helps",gen:"Letting people update their view privately, at their own pace, keeps judgements their own.",how:"Each teacher moved their support as they tried the tools, away from the pressure of a meeting."}],
      together:""},
    risky:{bullets:["People forget to update their support.","A few people care much more and keep topping up.","Decisions are needed quickly.","No one is around to run and explain the software."],
      title:"Students back proposals for the school's club fund through the year", where:"", text:"",
      why:"Conviction voting assumes people keep their support up to date. Most students placed theirs in September and never changed it, so their old choice kept building. By the time the film club was funded, most of its backers had lost interest.",
      forces:[
        {f:"exit_voice",e:"hurts",gen:"When taking part takes ongoing effort, people drift away instead of speaking up.",how:"Most students stopped opening the app, so their September choice kept counting long after their interest had moved on."},
        {f:"pluralistic_ignorance",e:"hurts",gen:"People assume others still want something because no one says otherwise.",how:"The support count kept rising, so everyone thought the film club was still popular."}],
      together:""},
    tips:["Use it for questions that stay open for months.","Send reminders so people check and update their support.","Set a higher threshold for proposals that ask for more.","Show everyone how support is building, and when it last changed."],
    refs:["emmett2019"]
  },
  futarchy:{
    actors:"15 staff · vote on the goal, bet on the plan", scene:"useful",
    useful:{title:"Which reading programme will work?", where:"A secondary school's leadership team in Singapore",
      text:"Staff vote on a goal: raise the share of Year 8 students reading at their age level by the end of the year. Then, using points instead of money, they predict how far each of two programmes would move that number. Teachers who work with weak readers bet heavily on the small-group programme, and the market shows it ahead. The school chooses it. By June, the share has risen more than the market predicted for either option.",
      why:"The vote settled what the school wanted, and the market drew out what teachers knew about how to get there. People closest to the problem had the most reason to bet.",
      forces:[
        {f:"independent",e:"helps",how:"Each teacher placed their own prediction. The market price combined many separate judgments, including from teachers who rarely speak in meetings."},
        {f:"shared_info",e:"helps",how:"The current market price was visible to everyone. Teachers who knew more could see whether the price matched what they knew and adjust it."}],
      together:"Separating the goal from the method kept values and predictions apart. Independent bets pooled what each teacher knew, and a visible price let better-informed people correct it. The school learned what its own staff thought would work."},
    risky:{title:"Betting on the measure, not the goal", where:"A foundation funding literacy NGOs in Ghana",
      text:"The foundation votes to fund whichever programme will raise reading test scores most, and asks its staff and partner NGOs to bet points on the options. The market favours intensive test preparation, which predictably raises scores. Scores rise, but partner teachers report less time for storytelling, writing and local-language reading, and children do no better the following year.",
      why:"The market predicted the measure well, but the measure was a poor stand-in for the goal. Once people bet on the number, the number became the target.",
      forces:[
        {f:"cascade",e:"hurts",how:"Early bets on test preparation pushed its price up, and later traders followed the price rather than thinking about wider learning."},
        {f:"groupthink",e:"hurts",how:"The foundation's board treated test scores as the obvious measure, and no one was asked to argue that scores might miss the point."}],
      together:"The foundation chose a narrow measure without challenge, and the market followed it faithfully. Early bets set the direction, and the rising price drew others along. The process did what it was designed to do, but it was aimed at the wrong target.",
      loop:{type:"R", nodes:["Focus on the test measure","Gains on the test","Confidence in the measure"], signs:["+","+","+"], note:"A reinforcing loop: gains on the measure make people more confident in it, which narrows the focus further."}},
    tips:["Choose the goal measure carefully, and check it against other evidence.","Use points, not money, in schools.","Keep the vote on values separate from the bets on methods."],
    refs:["hanson2013","bikh1992"]
  }
});
/* Entries, part 7: No one in charge */
Object.assign(FG.entries, {
  polycentric:{
    actors:"4 clusters · shared rules · local choices", scene:"useful",
    summary:"In polycentric governance, many local groups each decide their own part, within a few shared rules. No single centre decides for everyone. It works when the shared rules are clear and the groups meet to learn from each other. It fails at the edges between groups, where each assumes another is responsible.",
    useful:{bullets:["Local conditions differ, so one plan would not suit everyone.","A few shared standards are enough to keep everyone aligned.","Groups can learn from each other's results.","A mistake in one place does not spread to all."],
      title:"Four school clusters organise teaching under shared standards", where:"", text:"",
      why:"Shared rules kept every school working towards the same standards, while local freedom let each cluster try something different. Meeting each term let a good idea spread without anyone ordering it.",
      forces:[
        {f:"independent",e:"helps",gen:"Groups that try different approaches side by side learn more than one group following one plan.",how:"Each cluster tried its own approach, so the system tested several ideas at once instead of one plan for everyone."},
        {f:"network_shape",e:"helps",gen:"When groups are connected to each other, and not only to a centre, good ideas can travel.",how:"The clusters met each term and no one cluster sat at the centre, so the idea of longer science blocks could travel on its merits."}],
      together:""},
    risky:{bullets:["Each group follows the shared rules but plans on its own.","No one sees the combined effect of everyone's choices.","The rules cover each part, not the total.","Warning signs show up in several places at once, so each person sees only a piece."],
      title:"Heads of department each plan their own test calendar under a shared policy", where:"", text:"",
      why:"Every department kept to the shared policy, but the policy limited each subject, not the total any year group faced. Each head saw tired students in their own subject and assumed someone else was managing the overall load. No one owned the whole calendar, so the pile-up came back the next term.",
      forces:[
        {f:"diffusion",e:"hurts",gen:"When several people or groups could act, each feels less responsible, and all may wait.",how:"Any head could have moved a test, but each assumed the VP or another department would. With four people able to act, none did."},
        {f:"pluralistic_ignorance",e:"hurts",gen:"When no one else acts, people read the inaction as a sign that nothing is wrong.",how:"Each head saw the other departments carry on as planned and took it as a sign that the load was manageable."}],
      together:""},
    tips:["Write down who owns the gaps between areas, especially on boundaries.","Give one person responsibility for the combined effect, such as the whole test calendar for each year group.","Meet regularly to share results across groups.","Keep shared rules few and clear, and leave the rest to local choice."],
    refs:["ostrom2010","ostrom1990","darley1968"]
  },
  no_structure:{
    actors:"no agreed rules · decisions happen anyway", scene:"useful",
    summary:"With no structure, a group has no agreed way of deciding. Anyone can suggest anything, and plans come together through conversation. It works for small, friendly groups with a simple task, where everyone hears everything. In larger groups, decisions still get made, but by the best-connected people, out of sight, and newcomers can't see how to take part.",
    useful:{bullets:["The group is small and everyone talks to everyone.","The task is simple and low-stakes.","People broadly want the same thing.","Anyone can easily see the whole conversation."],
      title:"Five teachers plan the end-of-term picnic in a chat group", where:"", text:"",
      why:"A small group of colleagues with a simple, low-stakes task didn't need formal rules. All five could see and join the whole conversation, and everyone wanted the same thing, so the plan came together in two days.",
      forces:[
        {f:"network_shape",e:"helps",gen:"In a small group where everyone is connected, no one is left at the edge.",how:"All five were in the same chat, so everyone saw every suggestion."},
        {f:"coordination",e:"helps",gen:"When people want the same thing, they can fit in with each other without rules.",how:"People offered to bring things and agreed a date without anyone needing to chair."}],
      together:""},
    risky:{bullets:["Some members talk to each other far more than to the rest.","Newcomers can't see how decisions get made.","The stakes or the money involved are significant.","People who feel left out drift away without saying why."],
      title:"A parent group with no committee and no rules plans its fundraising", where:"", text:"",
      why:"With no agreed rules, decisions still got made, but by four friends who met every week, out of sight. A group with no formal structure still has one. It is just hidden and impossible to challenge. New parents stopped coming, and the fundraising always went to the same causes.",
      forces:[
        {f:"network_shape",e:"hurts",gen:"Without agreed rules, the best-connected people decide.",how:"The four friends talked every week, so plans were settled before any meeting began."},
        {f:"pluralistic_ignorance",e:"hurts",gen:"When people feel left out, each assumes it is only them.",how:"New parents who felt their ideas went nowhere didn't know others felt the same, so they drifted away."}],
      together:""},
    tips:["Use informal agreement only for small, simple, low-stakes decisions.","When a group grows, agree how decisions are made and write it down.","Make it easy to see where and when decisions happen.","Ask newcomers directly what they would change."],
    refs:["freeman1972","becker2017","ramchandani2019"]
  },
  bees:{
    actors:"scouts · several options · a quorum", scene:"useful",
    summary:"A honeybee swarm chooses a new home without a leader. Scouts visit possible sites on their own, come back and advertise them, more keenly for better sites. Others go to check for themselves, and the swarm moves once enough scouts are at one site. For people, this means checking options first-hand and waiting for a quorum of independent checks. It works when the quorum is high enough. It fails when it is so low that early enthusiasm decides.",
    useful:{bullets:["There are several options that can be checked first-hand.","Several people can visit or try options on their own.","You can wait until enough people have checked the same option.","Getting a good choice matters more than speed."],
      title:"Staff choose a site for a new outdoor study centre", where:"", text:"",
      why:"Each person checked a site for themselves before backing it, and the decision waited until four had backed the same one. Good sites drew attention faster, but no one could push a site that others had not seen.",
      forces:[
        {f:"independent",e:"helps",gen:"Judging an option first-hand keeps each person's view their own.",how:"Support for a site grew only when more staff had seen it with their own eyes."},
        {f:"cascade",e:"helps",gen:"Enthusiasm can spread attention to good options, as long as people still check for themselves.",how:"Keen reports sent others to look, but looking was not the same as backing."}],
      together:""},
    risky:{bullets:["The quorum is set very low.","Early reports are enthusiastic.","Few people check the options themselves.","Alternatives are not looked at before the decision."],
      title:"Staff choose a new curriculum provider", where:"", text:"",
      why:"The quorum was two. Two enthusiastic staff backed the first provider they saw, and the decision was made within a week, before anyone looked at the alternatives. A cheaper option with better reviews was never visited.",
      forces:[
        {f:"cascade",e:"hurts",gen:"Early excitement can send everyone toward one option.",how:"Two glowing reports sent attention to one provider, and the low quorum locked it in."},
        {f:"independent",e:"hurts",gen:"When few people check options themselves, their judgement never enters the decision.",how:"Most staff never saw any provider, so the choice rested on two people's first impressions."}],
      together:""},
    tips:["Set the quorum high enough that several people must check an option independently.","Ask scouts to report what they saw, and to visit, not just repeat others' reports.","Give the search a minimum time before anything can be decided.","Use a lower quorum only when speed matters more than getting the best option."],
    refs:["seeley2010","seeley2004"]
  },
  herd:{
    actors:"a crowd · a few who know the way", scene:"useful",
    summary:"In a herd, no one announces a direction. Each animal watches its neighbours, and a few that know where to go can steer the whole group just by moving. For people, this means placing informed people throughout a group instead of shouting instructions from the front. It works when the first movers know the way. It fails when the group follows whoever moves first and most confidently.",
    useful:{bullets:["A large group needs to move or act together quickly.","Announcements would be hard to hear or follow.","A few people know the way and can be spread through the group.","People naturally follow those near them."],
      title:"Students move from the opening ceremony to their sports-day fields", where:"", text:"",
      why:"A few marshals who knew the way, spread through the crowd, were enough to guide 600 students. Students followed the people near them, so placing informed people everywhere turned that habit into a guide.",
      forces:[
        {f:"conformity",e:"helps",gen:"People tend to do what those near them are doing.",how:"Students near each marshal followed, and the students near them followed in turn."},
        {f:"network_shape",e:"helps",gen:"Where informed people sit in a group matters as much as how many there are.",how:"Marshals were spread out, so every part of the crowd had someone nearby who knew the way."}],
      together:""},
    risky:{bullets:["No one knows who has the right information.","Confident people move first.","Signs are missing or unclear.","Doubters would have to stop alone to check."],
      title:"Students arrive for an exam in an unfamiliar building", where:"", text:"",
      why:"The crowd followed whoever moved first and most confidently, not whoever knew the way. Each follower made the wrong direction look more certain, and students who doubted it kept walking instead of stopping alone. The exam started late for them.",
      forces:[
        {f:"cascade",e:"hurts",gen:"Each person who follows makes a direction look more certain to the next.",how:"Every student heading to the wrong hall made that direction look right to the next arrival."},
        {f:"conformity",e:"hurts",gen:"Stopping alone feels harder than following the crowd.",how:"Students who doubted the direction kept walking with everyone else."}],
      together:""},
    tips:["Spread people who know the way through the group, not all at the front.","Brief a few people well, instead of announcing to everyone.","Put clear signs where people make choices.","Tell people it is fine to stop and check."],
    refs:["couzin2005","conradt2003","bikh1992"]
  },
  stigmergy:{
    actors:"no plan · traces guide the next person", scene:"useful",
    summary:"Ants find the shortest path to food without a plan. Each ant leaves a scent trail, and ants follow the strongest scent. Short paths get walked more often, so their scent builds fastest. For people, this means letting the traces of what others have done guide the next person. It works when the best option naturally gets used most. It fails when whatever came first gets copied most, good or not.",
    useful:{bullets:["The best option shows itself through use.","People can see what others have done.","You can wait and watch before deciding.","Copying a popular choice does little harm."],
      title:"A new campus decides where to lay its paths", where:"", text:"",
      why:"Each crossing wore the grass a little, and the shortest routes were walked most, so they became the clearest. After a term the grounds team paved the worn tracks, and the paths matched how people actually moved.",
      forces:[
        {f:"cumulative",e:"helps",gen:"What gets used becomes more visible, so it gets used more.",how:"Each footstep made a route easier to see, so more students took it."},
        {f:"coordination",e:"helps",gen:"Traces can coordinate people who never talk to each other.",how:"Students never agreed on routes. The worn grass showed each new walker where others had gone."}],
      together:""},
    risky:{bullets:["What comes first gets copied most, good or not.","Newcomers take popularity as approval.","No one checks the most copied option.","Mistakes spread as fast as good ideas."],
      title:"Teachers share lesson-plan templates in a shared folder", where:"", text:"",
      why:"The first template in the folder had a mistake. Each copy made it look more standard, and new staff copied what they saw most. Two years later most lesson plans in the school had the same flawed section.",
      forces:[
        {f:"cumulative",e:"hurts",gen:"An early lead can become a lasting one, whatever its quality.",how:"The first template was copied most, so it was the one most likely to be copied next."},
        {f:"cascade",e:"hurts",gen:"People take what most others have done as a sign it is right.",how:"New staff assumed the most common template was the approved one and copied it without checking."}],
      together:""},
    tips:["Let use show the best option before you fix it in place.","Check the most copied option, not just the newest.","Label approved versions clearly.","Remove or fix early versions once a better one exists."],
    refs:["goss1989","theraulaz1999","salganik2006"]
  },
  slime_mould:{
    actors:"start with every link · keep what is used", scene:"useful",
    summary:"A slime mould spreads out in every direction, then strengthens the links that carry the most food and lets the rest wither. The result is an efficient network that no one designed. For people, this means starting with many connections and keeping the ones that are used. It works for networks that need to fit real use. It fails when a link that matters rarely but greatly gets cut.",
    useful:{bullets:["You don't know in advance which links will matter.","You can start broad and watch what gets used.","Use can be measured, such as meetings held or materials shared.","Dropping an unused link costs little."],
      title:"A new network of eight schools decides which working groups to keep", where:"", text:"",
      why:"Starting with a working group between every pair of schools, then keeping the busy ones, let the network find its own shape. A year later it had fewer links, and the ones left were used weekly.",
      forces:[
        {f:"network_shape",e:"helps",gen:"A network that follows real use works better than one designed in advance.",how:"Links that schools used grew stronger, and unused ones were dropped."},
        {f:"cumulative",e:"helps",gen:"Links that get support early tend to grow stronger.",how:"Groups that shared materials early got more time and budget, which helped them share more."}],
      together:""},
    risky:{bullets:["Some links matter rarely but greatly.","Links are cut on use alone.","No one keeps a list of critical links.","There is no backup route when a link is cut."],
      title:"The school network reviews its working groups a year later", where:"", text:"",
      why:"The network closed the special needs group between two schools because it rarely met. That spring a student with complex needs moved between them, no one knew whom to call, and the student went six weeks without the right support.",
      forces:[
        {f:"network_shape",e:"hurts",gen:"Cutting a rarely used link can remove the only direct route between two groups.",how:"With the group closed, information about the student had to go the long way round."},
        {f:"cumulative",e:"hurts",gen:"Quiet links lose support until they close.",how:"Busy groups kept attracting support while the special needs group lost it every term."}],
      together:""},
    tips:["Start broad, then keep what is used.","Protect a short list of rarely used but critical links.","Name a contact for every link you cut.","Review cut links after a year."],
    refs:["tero2010","becker2017"]
  }
});

/* Conversion of the last 13 structures to the newer layout: summary, bullets, generic force lines. Stories now live in the example animations. */
(function(){
  const U = {
  quadratic:{summary:"In quadratic voting, everyone gets the same number of credits to spend across several options. One vote on an option costs 1 credit, two cost 4, three cost 9, so each extra vote costs more than the last. People can show that they care a lot about one thing, but no one can buy a landslide. It works when voters understand the price. It fails when only some do, because those who understand it can plan together.",
    useful:{bullets:["There are several options and people care about them unequally.","A simple count would let mild majority preferences win every time.","Voters have time to understand how the credits work.","Votes are allocated privately, without a running total."], why:"The rising price let the two students who cared most about the wellbeing room show it, without letting them swamp the vote. The project with the strongest support beat the one with the widest mild support.",
      gens:["A rising price lets strong feelings count without letting a few people take over.","Private voting stops early leaders from pulling in later voters."]},
    risky:{bullets:["People use it for the first time on a real decision.","No one runs a practice round.","Some voters understand the price much better than others.","Groups can agree in advance how to spend their credits."], why:"The method only measures how strongly people feel if they understand the price. The older students who understood it planned together, and their three projects took most of the budget.",
      gens:["People who agree a plan in advance can make their votes count for more.","A rule meant to limit any one voice can favour whoever understands it best."]}},
  nemawashi:{summary:"In nemawashi, a Japanese practice, the proposer talks to each key person one-to-one before any meeting, and changes the plan until no one will block it. The meeting then confirms what has already been agreed. It makes it safe to raise concerns in private and makes change quick to carry out. It works when the proposer visits everyone affected. It fails when they choose whom to visit, because the people left out never get a say.",
    useful:{bullets:["A change affects several people who each know something different.","People would not raise concerns in a full meeting.","There is time for weeks of conversations.","The proposer is willing to change the plan."], why:"Concerns came up in private, where they were safe to raise, and the plan changed before anyone had to take a public position. Because everyone affected had already agreed, the change was slow to decide but fast to carry out.",
      gens:["People raise worries one-to-one that they would keep quiet in a meeting.","Hearing people separately collects their own views, not one group mood."]},
    risky:{bullets:["The proposer chooses whom to visit.","Junior staff or families are left off the list.","The meeting presents the plan as settled.","No one is named as responsible once it is agreed."], why:"The principal chose whom to visit, so the people left out never had a say. By the meeting, objecting meant contradicting everyone senior in public. The smaller club drifted away, and because so many had agreed, no one person owned the result.",
      gens:["Whoever chooses whom to consult decides whose concerns count.","Once all the senior people agree, objecting means standing alone in public.","People who think they are the only doubter stay quiet, so the room looks united."]}},
  unanimity:{summary:"In a unanimous vote, a decision passes only if everyone agrees. Any one person can block it. That protects every voice and means everyone is committed to the result. It works for small groups with a shared goal and time to talk. It fails under pressure, when the person holding out is made to feel responsible for keeping everyone waiting.",
    useful:{bullets:["The group is small and shares a goal.","Everyone must follow the decision every time, as with a safety rule.","There is time to talk until each concern is dealt with.","The people with the most practical knowledge might otherwise be outvoted."], why:"On a safety rule, everyone needs to follow it every time. Requiring all twelve to agree meant every concern was dealt with, and every person committed to the result. The final rule was stricter than anyone first proposed.",
      gens:["When anyone can block, each person's knowledge has to be dealt with.","Once everyone has agreed, each person can rely on the others following the rule."]},
    risky:{bullets:["One person disagrees with everyone else.","There is a deadline, or the room cannot leave until it agrees.","The holdout is made responsible for everyone's time.","Dissent is not recorded once the vote is unanimous."], why:"Unanimity is meant to protect every voice, but under time pressure it can do the opposite. The person holding out carried the whole room's impatience, gave way, and the record shows agreement that was not real.",
      gens:["The pressure to match a unanimous group grows with every minute of waiting.","Seeing what happens to one dissenter keeps others quiet.","A unanimous record can hide private disagreement."]}},
  holacracy:{summary:"Holacracy organises work in circles of roles, and changes those roles through a fixed meeting script: the proposer explains, people ask questions, each person reacts once, the proposer adjusts, then each person is asked for objections. A facilitator keeps everyone to the steps. It works for small, concrete changes where a long debate would waste time. It fails when the rules themselves become the work, and only a few people understand them.",
    useful:{bullets:["The change is concrete, such as a new role or responsibility.","Meetings usually drift into long debates.","A trained facilitator runs the steps.","Everyone in the circle knows the script."], why:"The script kept the meeting to the point. Questions, reactions and objections each had their own turn, so the one real problem, admissions letters, surfaced and was fixed without a long debate.",
      gens:["Fixed turns with no replies keep each person's reaction their own.","Asking each person directly stops silence being taken for agreement."]},
    risky:{bullets:["The full system is adopted for every decision at once.","Only a few people understand the rules well.","Newer staff are unsure what counts as a valid objection.","Governance meetings take time from the actual work."], why:"The method only helps if people can use it easily. The rules became something only a few understood, the people who knew them decided what counted, and the time spent on them crowded out work with schools. A year later the team dropped the system.",
      gens:["Knowing a complicated process becomes a source of power.","People unsure of the rules stay quiet rather than get the process wrong in public."]}},
  lazy_consensus:{summary:"In lazy consensus, someone posts a proposal with a deadline, and if no one objects by then, it goes ahead. Silence counts as agreement. It saves meetings for the decisions that need them. It works for small, reversible decisions when everyone reads the message. It fails when people are too busy to read it, because then silence means nothing.",
    useful:{bullets:["The decision is small and easy to reverse.","Most people are likely to agree.","Everyone knows the rule that silence means yes.","There is enough time for everyone to read the proposal."], why:"Most decisions are small and most people agree. Lazy consensus let this one go ahead without a meeting, while anyone who disagreed still had a clear chance to say so. The next department meeting took 15 minutes instead of 45.",
      gens:["A known rule tells everyone whether they need to reply.","Reading a proposal alone keeps each judgment free of a nodding room."]},
    risky:{bullets:["The proposal goes out in a busy week.","The deadline is short.","The change is significant or hard to reverse.","No one checks whether people actually read it."], why:"Lazy consensus treats silence as agreement. That only works if people have a real chance to see and respond. The proposal went out in marking week, most lecturers never read it, and three who would have objected found out only when teaching started.",
      gens:["No objections can look like agreement when people simply did not read the message.","Whoever sets the timing and deadline has an advantage over everyone else."]}},
  kleroterion:{summary:"In selection by lot, named after the stone machine Athenians used to draw names, members of a body are chosen at random instead of elected or appointed. No one can campaign or arrange who is chosen, and people who would never volunteer get a turn. It works when the people drawn are supported to take part. It fails when they are not, because power moves to whoever prepares the information.",
    useful:{bullets:["The same confident people usually speak for everyone.","You want views from people who would never volunteer.","Those drawn can be supported with time and information.","No group should be able to arrange who takes part."], why:"A lottery reached students who would never volunteer or be elected. Their views were different from the usual voices, and the policy was better for it, including a quiet room as an alternative to detention.",
      gens:["When no one can predict who will be chosen, the usual few lose their head start.","A lottery reaches people outside the usual friendship groups."]},
    risky:{bullets:["Meetings are at times the people drawn cannot make.","There is no training or pay for their time.","Papers arrive too late to read.","One official prepares every paper and attends every meeting."], why:"Random selection only spreads power if the people chosen can take part. Without time, training or information, most drawn parents dropped out, and the official who prepared every paper ended up shaping every decision.",
      gens:["When others drop out, the one person who is always there decides.","Whoever prepares the information shapes what everyone else knows."]}},
  venice:{summary:"The Venetian method, used to elect the Doge of Venice for five centuries, alternates random draws and votes over several rounds before a final vote. Because the people in each round change by chance, no faction knows whom to pressure or buy. It works where capture by a faction is a real risk. It fails when people cannot follow the process, because a surprising result then looks fixed.",
    useful:{bullets:["One or two factions have controlled the result for years.","There are accusations of vote-buying or pressure.","People will accept a slower process to break that control.","The draws can be held in public."], why:"The mix of draws and votes made it hard for any faction to control the outcome, while still letting popular candidates rise. The winner came from neither faction, with 64% of the final vote.",
      gens:["When the people who decide change by chance at each stage, buying or pressuring them stops paying.","A high final threshold means candidates must appeal across the divide."]},
    risky:{bullets:["Few people understand the steps.","There is no practice run or public explanation.","The result surprises people.","Trust in the organisation is already fragile."], why:"A process people cannot follow is hard to trust, however fair it is. When a little-known candidate won, rumours that the draws were fixed spread faster than explanations, and several large members stopped paying their fees.",
      gens:["Without a shared picture of how a result was reached, rumours fill the gap.","Each person who repeats a doubt makes it seem more credible to the next."]}},
  delphi:{summary:"In the Delphi method, a group of experts answer a question alone and without names, a coordinator shares the range of answers and the reasons, and everyone revises over several rounds. No one knows whose answer is whose, so seniority carries no weight. It works when the panel brings different kinds of knowledge. It fails when the panel is alike, because the rounds then sharpen a shared mistake.",
    useful:{bullets:["You need a forecast or estimate, not a choice between values.","People with different kinds of knowledge can take part.","Senior voices would otherwise set the number.","There is time for two or three rounds."], why:"Keeping answers anonymous stopped the senior heads from setting the number, and seeing others' reasons, not just their numbers, let people improve their own estimates. The trust planned for 410 places; 404 students came.",
      gens:["Separate first answers have errors that point in different directions and partly cancel.","When no one knows whose answer is whose, there is no one to defer to.","Sharing reasons through one coordinator spreads information evenly."]},
    risky:{bullets:["The panel members share the same background and data.","No one on the panel is close to the ground.","The summary highlights the median, not the reasons.","Agreement is taken as proof of accuracy."], why:"The rounds produced agreement, but agreement isn't accuracy. The panel lacked people who knew the rural schools, and highlighting the median pulled everyone towards it. Two years later the teacher shortage was three times larger than forecast.",
      gens:["Seeing the middle answer, people move towards it without a new reason.","When everyone uses the same data, their mistakes line up instead of cancelling.","Questioning a shared picture can feel like questioning respected colleagues."]}},
  ngt:{summary:"In the nominal group technique, everyone writes ideas alone in silence, then shares one idea at a time round the room with no debate, and finally ranks the list privately on paper. Quiet people have their ideas ready before the confident ones speak, and no one sees how others rank. It works for generating and choosing among ideas. It fails on complex questions with hidden effects, because it leaves little room to discuss consequences.",
    useful:{bullets:["You want a wide range of ideas, not just the loudest ones.","Quieter or junior people have ideas worth hearing.","The choice is among ideas, not a complex trade-off.","People might otherwise follow senior colleagues."], why:"Writing alone first meant quieter staff had their ideas ready before the confident voices spoke. Ranking privately meant no one could see how others were voting, so a support worker's idea, a quiet lunchtime space, came second.",
      gens:["Writing alone first means every idea comes from one person's own thinking.","Ranking privately lets people choose without being seen to go against senior colleagues."]},
    risky:{bullets:["The question has effects most people cannot see.","Few people know what each option actually does.","Discussion is kept to a minimum.","No one who knows the area well is in the room."], why:"The method collects and ranks ideas well, but it keeps discussion short. Few knew what the first-year writing course did for struggling students, it was ranked first to cut, and second-year failure rates rose after it closed.",
      gens:["Without discussion, what only a few people know never reaches the rest.","Separate judgments only help if people have the knowledge to judge."]}},
  participatory_budgeting:{summary:"In participatory budgeting, a community proposes and votes on how to spend part of a real budget. Anyone can suggest a project, ideas are turned into costed proposals, and everyone votes. It shows people that their choices turn into real things. It works when the winning projects are built and everyone has a fair chance to take part. It fails when the best-organised groups turn out the most votes, so money follows organisation, not need.",
    useful:{bullets:["There is real money to spend, and the winners will be built.","People who are rarely heard can propose ideas.","Ideas can be costed before the vote.","Everyone gets one equal vote."], why:"Students saw real money spent on what they chose. The process taught them about budgets and each other's needs, and the winning projects were built the following term.",
      gens:["Open proposals and equal votes give rarely heard people an equal chance.","Costed proposals give every voter the same facts."]},
    risky:{bullets:["Some groups are much better organised than others.","Turnout decides the result.","There is no rule that weights need.","Meetings are at times and places that suit some people more."], why:"Participatory budgeting rewards the groups best able to turn out. Well-organised districts bused people to the assemblies and won most of the money, while schools in the poorest districts got little, year after year.",
      gens:["Groups with strong networks can bring many people to a vote.","Each win makes a group better organised for the next round."]}},
  polis:{summary:"Polis is an online tool for opinion mapping. People react to short statements by agreeing, disagreeing or passing, and can add statements of their own, but cannot reply to each other. The software groups people by how they vote and shows the statements every group agrees with. It works for finding common ground on a divisive issue. It fails when no one has committed to act on what it finds.",
    useful:{bullets:["An issue divides people into camps.","Many people need to take part, more than one meeting could hold.","You want to find common ground, not count sides.","The decider has said how the results will be used."], why:"Instead of measuring who was for or against, the process found what different groups had in common: sleep matters, and bus timing is the real obstacle. That gave the department a place to start.",
      gens:["Without replies, there are no arguments to escalate.","A private click lets people disagree when they would not say so aloud."]},
    risky:{bullets:["The real decider is not part of the consultation.","No one has said how the results will be used.","People give their time with no promise of a response.","Results are not reported back."], why:"The tool found agreement on homework help and football, but no one had committed to act on it. The funder renewed only the coding club, and turnout at the next consultation fell by more than half.",
      gens:["When the decider is outside the process, people's views have no route to the decision.","Each person who says “it's pointless” makes the next more likely to agree."]}},
  liquid:{summary:"In liquid democracy, members can vote on each subject themselves or pass their vote on that subject to someone they trust, and take it back at any time. Votes can be passed on again. It lets people use their own judgment where they know most and trust others where they don't. It works when people delegate by subject and check where their votes go. It fails when votes pile up with a few popular people at the end of long chains.",
    useful:{bullets:["Members know a lot about some subjects and little about others.","People trust particular colleagues on particular topics.","Votes can be taken back at any time.","Members can see where their vote went."], why:"Delegation let people use their own judgment where they knew most and trust others where they didn't. Being able to take a vote back kept delegates accountable.",
      gens:["Votes passed along trusted links reach people with real knowledge.","Members who vote directly where they feel confident keep many separate judgments in the mix."]},
    risky:{bullets:["Votes can be passed on again and again.","There is no cap on how many votes one person holds.","Members don't check where their vote ends up.","A few people are much better known than the rest."], why:"Delegation can concentrate power quickly when votes are passed on and people don't check. On exam policy, three super-delegates decided the result, though most members whose votes they used had never heard their view.",
      gens:["Popular delegates attract more delegations, which makes them more popular.","Votes flow towards the best-connected people at the centre."]}},
  futarchy:{summary:"In futarchy, people first vote on a goal, then bet, with points or money, on which plan will best reach it. The plan the market favours is chosen. It separates what people want from predictions about how to get there, and rewards people who know most. It works when the goal is measured well. It fails when the measure is a poor stand-in for the goal, because the market then chases the number.",
    useful:{bullets:["People agree on the goal but disagree about how to reach it.","The goal can be measured fairly.","People closest to the problem can take part.","Points are used instead of money."], why:"The vote settled what the school wanted, and the market drew out what teachers knew about how to get there. Teachers who work with weak readers had the most reason to bet, and the share reading at their age level rose more than predicted.",
      gens:["Each person's separate prediction adds to a price that combines them all.","A visible price lets better-informed people see when it is wrong and correct it."]},
    risky:{bullets:["The goal is measured by a narrow number, such as test scores.","No one is asked whether the measure fits the goal.","Early bets set the price that others follow.","Effects outside the measure are not tracked."], why:"The market predicted the measure well, but the measure was a poor stand-in for the goal. Test preparation raised scores, teachers lost time for storytelling and writing, and children did no better the following year.",
      gens:["Early bets push up a price that later traders follow.","A close group can treat a narrow measure as obvious and never challenge it."]}}
  };
  for (const id in U){ const e = FG.entries[id], u = U[id]; if (!e) continue; e.summary = u.summary;
    ["useful","risky"].forEach(k => { const c = e[k], v = u[k]; if (!c) return;
      c.bullets = v.bullets; c.why = v.why; c.text = ""; c.where = ""; c.together = ""; delete c.loop; delete c.model;
      c.forces.forEach((x,i) => { if (v.gens[i]) x.gen = v.gens[i]; }); }); }
})();

/* What happened to each force in each example: helped (a good force at work), held (the structure held a harmful force back),
   hurt (a harmful force at work), ignored (a force that could have helped was available but not used). */
(function(){ const ST = {"autocracy/useful/0": "helped", "autocracy/useful/1": "helped", "autocracy/useful/2": "held", "consultative/useful/0": "helped", "consultative/useful/1": "helped", "consultative/useful/2": "helped", "consultative/risky/0": "hurt", "consultative/risky/1": "ignored", "majority/useful/0": "helped", "majority/useful/1": "helped", "majority/risky/0": "hurt", "majority/risky/1": "ignored", "consent/useful/0": "held", "consent/useful/1": "held", "consent/risky/0": "hurt", "consent/risky/1": "hurt", "citizens_assembly/useful/0": "held", "citizens_assembly/useful/1": "helped", "citizens_assembly/risky/0": "ignored", "citizens_assembly/risky/1": "ignored", "citizens_assembly/risky/2": "hurt", "dot_voting/useful/0": "helped", "dot_voting/useful/1": "helped", "dot_voting/risky/0": "hurt", "dot_voting/risky/1": "hurt", "score_voting/useful/0": "helped", "score_voting/useful/1": "held", "score_voting/risky/0": "hurt", "score_voting/risky/1": "hurt", "quadratic/useful/0": "held", "quadratic/useful/1": "held", "quadratic/risky/0": "hurt", "quadratic/risky/1": "hurt", "nemawashi/useful/0": "held", "nemawashi/useful/1": "helped", "nemawashi/risky/0": "hurt", "nemawashi/risky/1": "hurt", "nemawashi/risky/2": "hurt", "oligarchy/useful/0": "helped", "oligarchy/useful/1": "helped", "oligarchy/useful/2": "helped", "oligarchy/risky/0": "ignored", "oligarchy/risky/1": "ignored", "chain_of_command/useful/0": "helped", "chain_of_command/useful/1": "helped", "chain_of_command/risky/0": "hurt", "chain_of_command/risky/1": "hurt", "chain_of_command/risky/2": "hurt", "advice_process/useful/0": "helped", "advice_process/useful/1": "helped", "advice_process/useful/2": "helped", "advice_process/risky/0": "hurt", "advice_process/risky/1": "hurt", "landsgemeinde/useful/0": "helped", "landsgemeinde/useful/1": "helped", "landsgemeinde/risky/0": "hurt", "landsgemeinde/risky/1": "hurt", "supermajority/useful/0": "held", "supermajority/useful/1": "helped", "supermajority/risky/0": "hurt", "supermajority/risky/1": "ignored", "unanimity/useful/0": "helped", "unanimity/useful/1": "helped", "unanimity/risky/0": "hurt", "unanimity/risky/1": "hurt", "unanimity/risky/2": "hurt", "liberum_veto/useful/0": "helped", "liberum_veto/useful/1": "helped", "liberum_veto/risky/0": "hurt", "liberum_veto/risky/1": "hurt", "voting_rules/useful/0": "held", "voting_rules/useful/1": "helped", "voting_rules/risky/0": "hurt", "voting_rules/risky/1": "ignored", "gram_sabha/useful/0": "helped", "gram_sabha/useful/1": "helped", "gram_sabha/risky/0": "ignored", "gram_sabha/risky/1": "hurt", "holacracy/useful/0": "held", "holacracy/useful/1": "held", "holacracy/risky/0": "hurt", "holacracy/risky/1": "hurt", "lazy_consensus/useful/0": "helped", "lazy_consensus/useful/1": "helped", "lazy_consensus/risky/0": "hurt", "lazy_consensus/risky/1": "hurt", "rough_consensus/useful/0": "helped", "rough_consensus/useful/1": "helped", "rough_consensus/risky/0": "hurt", "rough_consensus/risky/1": "hurt", "consensus_fallback/useful/0": "helped", "consensus_fallback/useful/1": "held", "consensus_discussion/useful/0": "helped", "consensus_discussion/useful/1": "helped", "indaba/useful/0": "held", "indaba/useful/1": "helped", "indaba/risky/0": "hurt", "indaba/risky/1": "hurt", "kleroterion/useful/0": "held", "kleroterion/useful/1": "held", "kleroterion/risky/0": "hurt", "kleroterion/risky/1": "hurt", "venice/useful/0": "held", "venice/useful/1": "held", "venice/risky/0": "ignored", "venice/risky/1": "hurt", "delphi/useful/0": "helped", "delphi/useful/1": "held", "delphi/useful/2": "helped", "delphi/risky/0": "hurt", "delphi/risky/1": "hurt", "delphi/risky/2": "hurt", "ngt/useful/0": "helped", "ngt/useful/1": "held", "ngt/risky/0": "ignored", "ngt/risky/1": "hurt", "participatory_budgeting/useful/0": "held", "participatory_budgeting/useful/1": "helped", "participatory_budgeting/risky/0": "hurt", "participatory_budgeting/risky/1": "hurt", "polis/useful/0": "held", "polis/useful/1": "held", "polis/risky/0": "hurt", "polis/risky/1": "hurt", "dao_token/useful/0": "helped", "dao_token/useful/1": "helped", "dao_token/risky/0": "hurt", "dao_token/risky/1": "hurt", "liquid/useful/0": "helped", "liquid/useful/1": "helped", "liquid/risky/0": "hurt", "liquid/risky/1": "hurt", "conviction/useful/0": "held", "conviction/useful/1": "helped", "conviction/risky/0": "hurt", "conviction/risky/1": "hurt", "futarchy/useful/0": "helped", "futarchy/useful/1": "helped", "futarchy/risky/0": "hurt", "futarchy/risky/1": "hurt", "polycentric/useful/0": "helped", "polycentric/useful/1": "helped", "polycentric/risky/0": "hurt", "polycentric/risky/1": "hurt", "no_structure/useful/0": "helped", "no_structure/useful/1": "helped", "no_structure/risky/0": "hurt", "no_structure/risky/1": "hurt", "bees/useful/0": "helped", "bees/useful/1": "held", "bees/risky/0": "hurt", "bees/risky/1": "ignored", "herd/useful/0": "helped", "herd/useful/1": "helped", "herd/risky/0": "hurt", "herd/risky/1": "hurt", "stigmergy/useful/0": "helped", "stigmergy/useful/1": "helped", "stigmergy/risky/0": "hurt", "stigmergy/risky/1": "hurt", "slime_mould/useful/0": "helped", "slime_mould/useful/1": "helped", "slime_mould/risky/0": "hurt", "slime_mould/risky/1": "hurt"};
  for (const k in ST){ const [id, kind, i] = k.split("/"); const x = ((FG.entries[id] || {})[kind] || {}).forces; if (x && x[+i]) x[+i].st = ST[k]; } })();
