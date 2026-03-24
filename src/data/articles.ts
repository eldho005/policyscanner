export interface ArticleSection {
  heading: string;
  body: string;
}

export interface Article {
  slug: string;
  tag: string;
  title: string;
  description: string;
  author: string;
  date: string;
  readTime: string;
  image: string | null;
  gradientClass: string;
  sections: ArticleSection[];
  relatedSlugs: string[];
}

export const articles: Article[] = [
  {
    slug: "term-vs-whole-life-insurance-canada",
    tag: "Guide",
    title: "Term vs. Whole Life Insurance in Canada",
    description:
      "Discover the key differences between the two main types of life insurance and find the best option for your family's future.",
    author: "Eldho George, LLQP RIBO",
    date: "March 15, 2026",
    readTime: "10 min read",
    image: "https://res.cloudinary.com/dy4lolmvf/image/upload/f_auto,q_auto,w_1200/v1774318010/article1_vwc8dr.webp",
    gradientClass: "gradient-warm-1",
    sections: [
      {
        heading: "Understanding term and whole life insurance",
        body: "If you are shopping for life insurance in Canada, you have probably come across two main types: term life insurance and whole life insurance. They both pay a death benefit to your beneficiaries, but how they work, what they cost, and who they are best suited for are very different.\n\nTerm life insurance covers you for a specific period — typically 10, 15, 20, 25, or 30 years. If you pass away during the term, your beneficiaries receive the full death benefit. Once the term expires, the coverage ends unless you renew it, usually at a significantly higher premium. There is no savings component. Think of it as pure, straightforward protection for a defined period.\n\nWhole life insurance, on the other hand, covers you for your entire lifetime as long as you keep paying premiums. A portion of every premium payment goes into a cash value account that grows at a guaranteed rate set by the insurer. You can borrow against this cash value or surrender the policy to access it. Whole life is both an insurance product and a long-term savings vehicle, which is why it costs considerably more.\n\nUnderstanding this fundamental difference — temporary versus permanent, pure protection versus protection plus savings — is the starting point for making the right choice for your family.",
      },
      {
        heading: "How premiums compare in Canada",
        body: "The price difference between term and whole life insurance is substantial, and it catches many first-time buyers off guard.\n\nFor a healthy 35-year-old non-smoking Canadian seeking $500,000 in coverage, a 20-year term policy might cost somewhere between $25 and $40 per month. The same person looking at whole life insurance for the same face amount could pay anywhere from $250 to $400 per month — roughly 10 times more.\n\nWhy such a large gap? Term insurance is priced on probability. Most policyholders will outlive their term, meaning the insurer rarely pays out. Whole life insurance is priced on certainty. Everyone dies eventually, so the insurer will always pay the death benefit. Add the guaranteed cash value growth on top, and you can see why the premiums are significantly higher.\n\nThis does not mean one is better than the other. It means they serve different financial purposes at different stages of life. A young family with a tight budget and a large mortgage is in a very different position than a business owner doing estate planning at age 55.",
      },
      {
        heading: "When term life insurance is the right choice",
        body: "Term life insurance is the most popular type of life insurance in Canada for good reason. It offers the highest coverage amount for the lowest premium, making it ideal for people with specific, time-limited financial obligations.\n\nTerm life makes sense when you have a mortgage with 15 to 25 years remaining and you want to make sure your family can keep the home if something happens to you. It makes sense when your children are young and dependent on your income to cover their living expenses, education, and childcare costs. It is the right choice when you have business loans or debts that would fall on your family if you were not around to pay them off.\n\nMost Canadian financial advisors, including the Financial Consumer Agency of Canada, recommend term life insurance as the foundation of a sound protective plan. It covers the years when your family is most financially vulnerable — when the mortgage is large, the kids are young, and your savings have not yet had decades to grow.\n\nA common approach is to match the term length to your longest obligation. If your youngest child is 3 and you want coverage until they are financially independent, a 20-year term covers you until they are 23. If your mortgage has 25 years left, a 25-year term aligns perfectly.",
      },
      {
        heading: "When whole life insurance makes more sense",
        body: "Whole life insurance is not for everyone, but for certain financial situations it is the right tool.\n\nIt becomes valuable when you want to leave a guaranteed inheritance to your beneficiaries regardless of when you pass away. Unlike term insurance, which expires, whole life ensures there will always be a payout. This matters for people who want to leave a legacy, cover final expenses like funeral costs and probate fees, or equalize an estate between heirs when one child is inheriting a family business and the other is not.\n\nWhole life insurance is also used as a tax planning tool by high-net-worth Canadians. If you have already maximized your RRSP and TFSA contribution room, the cash value inside a whole life policy grows on a tax-deferred basis. Upon death, the proceeds pass to your beneficiaries tax-free. This makes it a legitimate estate planning vehicle when used correctly.\n\nOther scenarios where whole life makes sense include providing for a dependent with special needs who will require lifelong financial support, funding a buy-sell agreement between business partners, and creating a tax-efficient way to transfer wealth to the next generation.\n\nThe key question to ask yourself is whether you have a permanent need — one that will exist no matter when you die — or a temporary need that will naturally resolve over time. If the need is permanent, whole life deserves consideration.",
      },
      {
        heading: "Combining term and whole life insurance",
        body: "You do not have to choose one or the other. Many Canadians use a combination of both, and this blended approach is often the most practical solution.\n\nA common strategy is to purchase a large term policy to cover your working years — for example, a $1,000,000 20-year term to protect your family during the high-responsibility years when you have a mortgage, young children, and growing debts — and pair it with a smaller whole life policy, perhaps $100,000 to $250,000, to cover permanent needs like final expenses and a modest inheritance.\n\nThis approach gives you maximum coverage when you need it most while ensuring some protection is always in place. As the term policy expires and your children become independent, your savings grow, and your debts shrink, the whole life policy remains to handle your final estate needs.\n\nAnother option worth knowing about is the conversion privilege built into most Canadian term policies. This allows you to convert part or all of your term coverage to a permanent policy without a new medical exam. So if your financial situation changes and you decide you need permanent coverage later, the option is already built in. Not all conversion windows are the same, so it is important to ask about the conversion deadline when purchasing a term policy.",
      },
      {
        heading: "How to decide: a practical framework",
        body: "Choosing between term and whole life insurance does not have to be complicated. Start by asking yourself three questions.\n\nFirst, is the financial need I am protecting against temporary or permanent? If your main concern is replacing your income while your kids grow up and your mortgage gets paid off, that need is temporary, and term insurance is the logical choice. If you want to guarantee an inheritance or cover estate taxes that will exist no matter when you die, that need is permanent, and whole life is worth exploring.\n\nSecond, can I afford whole life premiums without sacrificing other important financial goals? If paying $300 a month for whole life insurance means you cannot contribute enough to your RRSP or TFSA, you are hurting your overall financial plan. A well-funded retirement account will almost always provide more long-term financial security than a cash value insurance policy.\n\nThird, have I already maximized my registered savings room? If your RRSP and TFSA are fully funded and you are looking for additional tax-advantaged ways to grow wealth, whole life insurance starts to make sense as a planning tool.\n\nFor most young Canadian families, the right answer is a well-sized term policy purchased as early as possible to lock in the lowest premiums. You can always add whole life coverage later as your income grows and your financial priorities shift. The most important step is not choosing the perfect product — it is getting some level of protection in place now.",
      },
    ],
    relatedSlugs: [
      "how-much-life-insurance-coverage-do-you-need",
      "best-time-to-buy-life-insurance",
    ],
  },
  {
    slug: "how-much-life-insurance-coverage-do-you-need",
    tag: "Calculator",
    title: "How Much Life Insurance Coverage Do You Actually Need?",
    description:
      "Use our smart framework to find your ideal life insurance amount based on your income, debts, and family situation.",
    author: "Eldho George, LLQP RIBO",
    date: "March 8, 2026",
    readTime: "10 min read",
    image: "https://res.cloudinary.com/dy4lolmvf/image/upload/f_auto,q_auto,w_1200/v1774318010/article2_wvttq9.webp",
    gradientClass: "gradient-warm-2",
    sections: [
      {
        heading: "Why most Canadians are underinsured",
        body: "According to research by LIMRA and the Canadian Life and Health Insurance Association, nearly half of Canadian households say they do not have enough life insurance. The average coverage gap is approximately $200,000 — meaning that if the primary earner passed away, the surviving family would be short by that amount to maintain their current standard of living.\n\nThe problem is not a lack of awareness. Most Canadians know they need life insurance, especially once they have dependents, a mortgage, or both. The problem is that figuring out how much coverage to buy feels complicated. There is no standard amount that works for everyone, and the fear of either overpaying for too much coverage or being dangerously underinsured leads many people to simply guess or put the decision off entirely.\n\nThis guide walks you through a straightforward framework used by financial advisors across Canada to calculate the life insurance coverage amount that actually fits your family's situation. No complicated spreadsheets required.",
      },
      {
        heading: "The DIME method explained",
        body: "Financial planners commonly use a framework called DIME to estimate how much life insurance a person needs. DIME stands for Debt, Income, Mortgage, and Education — the four largest financial obligations your family would face without you.\n\nStart with Debt. Add up all of your outstanding debts excluding the mortgage — car loans, credit card balances, lines of credit, student loans, and any other personal debts. These would need to be paid off or would become a burden on your surviving family.\n\nNext is Income. This is usually the largest number. Multiply your annual gross income by the number of years your family would need financial support. For most families, this is somewhere between 10 and 15 years — enough time for a surviving spouse to adjust, retrain if needed, and for children to grow up and become self-sufficient.\n\nThen add Mortgage. If you did not already include your mortgage in the debt category, add the full remaining mortgage balance here. For many Canadian families, the mortgage is the single largest financial obligation, and ensuring it gets paid off is often the primary reason people buy life insurance in the first place.\n\nFinally, add Education. If you have children, estimate the cost of post-secondary education for each child. In Canada, a four-year university degree including tuition, books, and living expenses can cost between $80,000 and $120,000 per child depending on the province and program.\n\nAdd all four numbers together. That total is your baseline life insurance coverage need.",
      },
      {
        heading: "Adjusting the number for your real life",
        body: "The DIME formula gives you a solid starting point, but every family has unique circumstances that require adjustments.\n\nYou may need to adjust your coverage upward if you are a single-income household where your family has no fallback income if you pass away. If you have aging parents who depend on you financially for their living expenses or medical care, that ongoing responsibility should be factored in. If your spouse would need to return to school or retrain to re-enter the workforce after years away, the cost and time of that transition adds to your coverage need. And if leaving an inheritance is important to you, that amount should be included on top of your protective needs.\n\nOn the other hand, you may be able to adjust downward if your spouse earns a strong income that could independently cover most household expenses. Significant existing savings and investments — RRSPs, TFSAs, non-registered portfolios — reduce the gap your insurance needs to fill. Employer-provided group life insurance also counts, though it typically only covers one to two times your salary, which is rarely enough on its own, and it disappears if you change jobs.\n\nThe goal is not to arrive at a precise-to-the-dollar number. It is to land on a coverage amount that gives your family a realistic financial bridge — enough time and money to grieve, adjust, and rebuild without the added pressure of financial crisis.",
      },
      {
        heading: "A worked example for an Ontario family",
        body: "Let us walk through a concrete example. Suppose you are a 34-year-old parent living in the Greater Toronto Area, earning $85,000 per year with two young children.\n\nDebt: You have a $15,000 car loan and $8,000 in credit card debt, totalling $23,000.\n\nIncome replacement: At $85,000 per year and assuming your family would need 12 years of support (until your youngest child is independent), that comes to $1,020,000.\n\nMortgage: You have $380,000 remaining on your mortgage.\n\nEducation: With two children and an estimated $100,000 each for university, that adds $200,000.\n\nYour total DIME calculation comes to $1,623,000. Now subtract any existing coverage — if you have a group life insurance policy through work worth $170,000, your net need is approximately $1,450,000.\n\nMost people would round this to a $1,500,000 term life insurance policy. For a healthy non-smoking 34-year-old in Ontario, a 20-year term policy at this coverage level might cost between $55 and $75 per month depending on the insurer. That is roughly two dollars a day to ensure your family's mortgage, education, and daily expenses are fully covered.\n\nThis example illustrates why comparing quotes from multiple insurers matters. A $20 per month difference in premiums over 20 years adds up to $4,800 — real money that stays in your pocket by shopping around.",
      },
      {
        heading: "Common mistakes when calculating coverage",
        body: "One of the most frequent mistakes is relying solely on employer group insurance. Group life insurance is a valuable benefit, but it typically covers only one to two times your annual salary. For someone earning $85,000, that means $85,000 to $170,000 — far less than the $1,500,000 the DIME calculation suggested. Group coverage also ends when you leave the job, which means you could lose protection at the exact moment you need it most, like during a career transition or health scare.\n\nAnother common mistake is not accounting for inflation. The cost of living, education, and housing will all increase over time. When calculating income replacement, consider that the purchasing power of the coverage amount will decline over a 20-year period. Some advisors suggest adding an extra 10 to 15 percent as a buffer.\n\nFailing to account for Canada Pension Plan (CPP) survivor benefits is also an overlooked factor. If you have been contributing to CPP, your surviving spouse and dependent children may be eligible for monthly survivor benefits. While these amounts are not large enough to replace life insurance, they can reduce the overall gap. As of 2026, the maximum CPP death benefit is $2,500 and monthly survivor pensions vary based on the contributor's record.\n\nFinally, many people make the mistake of buying too little insurance because they are focused on the premium cost. A $500,000 policy costs less than a $1,500,000 policy, but if your family actually needs $1,500,000, cutting corners leaves them exposed. It is better to buy the right amount of term insurance, which is affordable, than to buy an inadequate amount just to keep the monthly payment low.",
      },
      {
        heading: "When to reassess your life insurance coverage",
        body: "Your life insurance needs are not static. They change as your life changes, and regularly reviewing your coverage ensures it keeps pace with your actual situation.\n\nReassess your coverage every three to five years as a general rule. But certain life events should trigger an immediate review: the birth or adoption of a child, purchasing a new home or refinancing your mortgage, a significant salary increase or career change, paying off a major debt like a car loan or student loan, divorce or remarriage, and taking on financial responsibility for an aging parent.\n\nAs you move through life, your insurance needs will generally decrease. Your mortgage balance shrinks, your children grow up and become self-sufficient, and your retirement savings grow. At some point, you may not need life insurance at all — your savings and assets may be sufficient to provide for your spouse in retirement.\n\nBut in the years when the need is real — when the mortgage is large, the kids are young, and your family depends on your paycheque — having the right amount of life insurance is one of the most important financial decisions you can make. The best time to calculate your number is today.",
      },
    ],
    relatedSlugs: [
      "term-vs-whole-life-insurance-canada",
      "best-time-to-buy-life-insurance",
    ],
  },
  {
    slug: "best-time-to-buy-life-insurance",
    tag: "Advice",
    title: "When Is the Best Time to Buy Life Insurance?",
    description:
      "Why buying life insurance earlier can mean huge savings for the rest of your life — and the real cost of waiting.",
    author: "Eldho George, LLQP RIBO",
    date: "February 28, 2026",
    readTime: "10 min read",
    image: "https://res.cloudinary.com/dy4lolmvf/image/upload/f_auto,q_auto,w_1200/v1774318010/article3_blsbch.webp",
    gradientClass: "gradient-warm-3",
    sections: [
      {
        heading: "The short answer: as early as possible",
        body: "If there is one piece of advice that every life insurance advisor in Canada agrees on, it is this: buy life insurance as early as you can.\n\nLife insurance premiums are calculated based on two primary factors — your age and your health at the time of application. Every year you wait, your rate increases, even if your health stays exactly the same. The insurance company is pricing the statistical risk of insuring you, and that risk goes up with every birthday.\n\nTo put real numbers to this: a 25-year-old non-smoking Canadian might pay around $18 per month for a $500,000 20-year term life insurance policy. By age 30, the same policy costs approximately $24 per month. By age 35, it rises to around $32 per month. By age 40, you are looking at roughly $55 per month. And by age 45, the premium jumps to approximately $85 per month.\n\nThat is a nearly fivefold increase from 25 to 45 — for the exact same coverage amount and term length — caused entirely by age. Your health, lifestyle, occupation, and smoking status all factor in as well, but age is the single biggest driver of premium cost. Every year you delay costs you real money over the life of the policy.",
      },
      {
        heading: "How your health affects the equation",
        body: "Age is the most predictable factor, but health is what can truly make life insurance expensive or even inaccessible.\n\nWhen you apply for life insurance in Canada, the insurer evaluates your current health to assign you a rate class. The healthiest applicants receive preferred or preferred plus rates, which are the lowest premiums available. Standard rates are still reasonable. But if you have health conditions — high blood pressure, elevated cholesterol, Type 2 diabetes, a history of anxiety or depression, sleep apnea, or obesity — you may be placed in a rated category with premiums that can be 25 to 100 percent higher than standard.\n\nThe challenge is that health conditions accumulate with age. A 28-year-old is statistically less likely to have high blood pressure or elevated cholesterol than a 42-year-old. By waiting, you are not just paying more because of your age — you are increasing the chances that a new health condition will push you into a more expensive rate class.\n\nIn the worst case, waiting too long means you may be declined entirely. Certain conditions — recent cancer treatments, serious heart conditions, or insulin-dependent diabetes — can make it extremely difficult to obtain traditional life insurance at any price.\n\nWhen you buy young and healthy, you lock in your best rate class for the entire duration of the policy. Even if you are diagnosed with a serious illness two years after purchasing your policy, your premium does not change. That locked-in rate is one of the most valuable aspects of buying early.",
      },
      {
        heading: "Life events that should trigger a purchase",
        body: "While buying as early as possible is the general rule, certain life events should make purchasing life insurance an urgent priority if you do not already have it.\n\nGetting married is a major trigger. When you legally join your finances with another person, your spouse becomes financially dependent on your income to some degree. If you were to pass away, your spouse could face the reality of covering rent or mortgage payments, car payments, and daily expenses on a single income.\n\nBuying a home is another critical moment. A mortgage is likely the largest financial obligation you will ever take on. For most Canadian families, the mortgage payment represents a substantial portion of monthly expenses. Life insurance ensures your family can stay in the home even if the primary earner is gone.\n\nHaving a child changes everything. A new human being is now entirely dependent on you — for food, shelter, clothing, childcare, education, and everything in between. The financial responsibility of raising a child from birth to independence in Canada can easily exceed $250,000, not including post-secondary education.\n\nStarting a business creates responsibilities that extend beyond your family. If you have a business partner, employees, or outstanding business debts, life insurance can fund a buy-sell agreement, cover business loans, or provide continuity for the people who depend on the company.\n\nTaking on any significant debt — a car loan, a line of credit, co-signing for a family member — adds to the financial exposure your family would inherit if something happened to you.\n\nIf any of these events have already happened in your life and you do not have life insurance, the best time to act is right now. Not next month, not next year — today.",
      },
      {
        heading: "The real cost of waiting: a dollar comparison",
        body: "Abstract advice to buy early is helpful, but concrete numbers make the urgency clear.\n\nConsider two Canadians buying identical $750,000 20-year term life insurance policies. Person A buys at age 30 and pays approximately $32 per month. Person B waits until age 40 and pays approximately $71 per month.\n\nPerson A: $32 per month multiplied by 240 monthly payments over 20 years equals $7,680 in total premiums paid.\n\nPerson B: $71 per month multiplied by 240 monthly payments over 20 years equals $17,040 in total premiums paid.\n\nBy waiting 10 years, Person B pays $9,360 more for the exact same coverage, same term length, same death benefit. And this assumes Person B's health remained perfect over that decade — if a new diagnosis bumped them from preferred to standard or rated, the cost could easily double again.\n\nNow consider the 10-year gap itself. During those 10 years that Person B had no coverage, their family was completely unprotected. If something had happened during that window — an accident, an unexpected illness — there would have been no death benefit, no mortgage payoff, no income replacement. That is the hidden cost of waiting that does not show up in a premium comparison: the years of exposure when your family has nothing.\n\nThe math is clear. Buying earlier means lower premiums, lower total cost, and more years of protection for the people who depend on you.",
      },
      {
        heading: "What if you cannot afford much right now",
        body: "One of the most common reasons people delay buying life insurance is cost. They feel they cannot afford the premium on top of rent, groceries, car payments, and everything else. But this framing overlooks how affordable basic life insurance actually is, especially for young, healthy Canadians.\n\nA $250,000 20-year term policy for a healthy non-smoking 28-year-old might cost less than $15 per month. That is less than a single streaming subscription. It is less than two takeout coffees a week. For that amount, your family receives a quarter of a million dollars if the worst happens.\n\nIf $15 per month truly is not feasible right now, start even smaller. Some Canadian insurers offer $100,000 term policies for as little as $8 to $10 per month for young applicants. The point is to get something in place — any amount of coverage is infinitely better than none.\n\nAnother important feature to know about is the conversion privilege offered by most Canadian term life insurance policies. This allows you to convert part or all of your term coverage to a permanent whole life policy at a later date without a new medical exam. So if you buy a small term policy now at your current healthy rate class, you preserve the option to increase or convert your coverage in the future even if your health changes.\n\nYou can also increase your coverage over time as your income grows. Many people start with a modest policy in their mid-twenties and add additional coverage when they get married, buy a home, or have children. Each new policy is purchased at whatever age you are at that point, but the original policy continues at your original locked-in rate.",
      },
      {
        heading: "How to take the next step",
        body: "If you have read this far, you already understand the value of buying life insurance sooner rather than later. The next step is straightforward.\n\nStart by getting a sense of what coverage you need. Consider your debts, your income that would need to be replaced, your mortgage balance, and the future education costs of any children. A rough calculation takes five minutes and gives you a target coverage amount to work with.\n\nThen compare quotes from multiple insurers. Life insurance premiums in Canada can vary significantly between companies for the exact same coverage — sometimes by 30 percent or more. Comparing quotes is the single most effective way to ensure you are not overpaying.\n\nPay attention to the insurer's financial strength ratings from agencies like A.M. Best or DBRS Morningstar. A life insurance policy is a long-term contract, and you want to buy from a company that will be around to pay the claim in 20 or 30 years.\n\nFinally, do not overthink it. Life insurance is not a decision you need to optimize to perfection. The most common regret people have about life insurance is not buying it sooner. A good policy purchased today is worth more than a perfect policy you keep putting off until next year.\n\nYour family depends on you. The best time to protect them was yesterday. The second best time is today.",
      },
    ],
    relatedSlugs: [
      "term-vs-whole-life-insurance-canada",
      "how-much-life-insurance-coverage-do-you-need",
    ],
  },
];

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}

export function getRelatedArticles(slugs: string[]): Article[] {
  return slugs
    .map((s) => articles.find((a) => a.slug === s))
    .filter((a): a is Article => a !== undefined);
}
