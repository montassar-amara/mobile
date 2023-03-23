import { Component, OnInit } from '@angular/core';
import { IFaq } from 'src/app/shared/models/faq';
@Component({
  selector: 'app-faqs',
  templateUrl: './faqs.component.html',
  styleUrls: ['./faqs.component.scss'],
})
export class FaqsComponent implements OnInit {
  public colapsed: boolean[] = [];
  public faqs: IFaq[] = [
    {
      question: 'What does the due diligence look like at Valpal?',
      answer: [
        'For each company that we cover we employ a multifactorial rating system that thoroughly covers the quality of the business and allows for comparison between different investment opportunities. This system is based on the findings of 1. Quantitative model of the business (Valuation model) and 2. Qualitative analysis of the business (Research Report). This system allows for increased clarity and actionability whilst preserving the thoroughness that is required for high quality analysis. As an example, when valuing a mining company, we breakdown the investment case in 5 rating factors:',
        '• Valuation',
        '• Quality of Assets',
        '• Mining Jurisdictions',
        '• ESG',
        '• Management',
        'The valuation rating is our quantitative metric and is derived from the valuation model, it is entirely based on what the company is priced at in the market relative to the inherit value of the company as calculated by the model. The remaining ratings are qualitative and are covered extensively in the research report.',
        'These rating factors in turn feeds into the overall rating which gives a final indication of how good an investment opportunity the company is. We use a continuous rating scale of 0 - 5, 5 being the highest possible rating (an exceedingly rare occurrence). ',
      ],
    },
    {
      question: 'How does your rating system work?',
      answer: [
        'Our starting point is to select the most relevant factors "rating factors" one would be interested in for a company in a particular peer-group/"sector". The companies are rated between 0-5 for all of the rating factors, these ratings transmit the core aspects of the investment case of the company, and they in turn feed into the "Analyst\'s Rating" which is a final score between 0-5 that takes all of the rating factors into consideration. An example:',
        'First Majestic Silver has as of 2022-12-24 the following rating factor scores:',
        'Valuation: 1.7 / 5',
        'Assets: 2.8 / 5',
        'Jurisdictions: 3.2 / 5',
        'ESG: 4.4 / 5',
        'Management: 3.7 / 5',
        'The above rating factor categories are the same for all companies within the "Silver Miners" peer-group and one rating factor score can be directly compared to the same rating factor score of another peer-group company. The Analyst takes these rating factors as well as some other aspects into consideration and sets a final (Overall) rating for the company:',
        "Analyst's Rating: 2.7 / 5",
        'For comparison between companies within different peer-groups/"sectors" one should not compare rating factors but instead compare the Analyst\'s Rating, as this final score presents the analysts opinion of how good the investment opportunity is, independent of which peer-group the company belongs to.',
      ],
    },
    {
      question: 'How often do you provide updates for your covered companies?',
      answer: [
        'Our baseline is to provide an update on a quarterly basis, but we frequently provide updates in the interim when significant events need to be analyzed and shared. As an example, in a recent event Pan American Silver announced an acquisition of Yamana Gold’s Latin American assets (this acquisition is almost certain to go through) therefore we work overtime to as quickly as possible analyze this transaction to provide a timely update to the subscribers of Pan American Silver about the quality of this transaction. We want our users to have the good information fast, so that they have an edge in the market.',
        'It should be stated that we have a pragmatic approach of quality and no-nonsense, therefore we only share what is relevant, no unnecessary noise.',
      ],
    },
    {
      question: 'How do you model the value of a business?',
      answer: [
        'We employ the tried-and-true method of discounting cashflows, in the end creating value for shareholders necessitates free cash flow generation, or the optionality of generating free cash in the future. Models vary in complexity and structure depending on the business, but in the end it all boils down to cash flows, one could hold the opinion that all else is fancy talk.',
      ],
    },
  ];
  constructor() {
    this.colapsed = this.faqs.map((faq) => true);
  }

  ngOnInit(): void {}
}
