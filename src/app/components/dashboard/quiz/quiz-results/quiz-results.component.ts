import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from '../../../../shared/services/http.service';

interface QuizOption {
  label: string;
  option_key: string;
  next_question_key?: string | null;
}

interface QuizQuestion {
  question_key: string;
  question_text: string;
  result_key?: string | null;
  options: QuizOption[];
}

interface GeneratedOutcome {
  title: string;
  summary: string;
  result_key: string;
  result_group: string;
  path: Array<{
    questionText: string;
    optionLabel: string;
    optionKey: string;
  }>;
  source: 'grok' | 'fallback';
}

@Component({
  selector: 'app-quiz-results',
  templateUrl: './quiz-results.component.html',
  styleUrls: ['./quiz-results.component.scss']
})
export class QuizResultsComponent implements OnInit {
  quizId: number | null = null;
  quiz: any = null;
  isLoading = false;
  isGenerating = false;
  errorMessage: string | null = null;
  outcomes: GeneratedOutcome[] = [];
  usedFallback = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpService
  ) {}

  ngOnInit(): void {
    this.quizId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadQuiz();
  }

async loadQuiz(): Promise<void> {
  this.isLoading = true;
  this.errorMessage = null;

  try {
    const res: any = await this.http.get(`/quiz/${this.quizId}`, true).toPromise();

    let data = res?.data?.data ?? res?.data ?? null;

    if (data && !Array.isArray(data)) {
      if (Number(data.id) === this.quizId) {
        this.quiz = {
          ...data,
          questions: this.normalizeQuestions(data.questions)
        };
      } else {
        this.quiz = null;
      }
    }

  } catch (error) {
    console.error('Error loading quiz:', error);
    this.errorMessage = 'Unable to load quiz.';
  } finally {
    this.isLoading = false;
  }
}

private normalizeQuestions(questions: any): any[] {
  if (Array.isArray(questions)) {
    return questions;
  }

  if (typeof questions === 'string') {
    try {
      const parsed = JSON.parse(questions);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error('Error parsing questions:', error);
    }
  }

  return [];
}

  async generateOutcomes(): Promise<void> {
    if (!this.quiz) {
      return;
    }

    this.isGenerating = true;
    this.usedFallback = false;
    this.errorMessage = null;

    try {
      const payload = {
        quiz_id: this.quiz.id,
        quiz: this.quiz
      };

      const res: any = await this.http.post('/quiz/generate-outcomes', payload, true).toPromise();
      const outcomes = res?.data?.outcomes || res?.outcomes || [];

      if (Array.isArray(outcomes) && outcomes.length) {
        this.outcomes = outcomes.map((item: any) => ({
          title: item.title || item.name || item.result_key,
          summary: item.summary || item.description || '',
          result_key: item.result_key || item.key || 'result',
          result_group: item.result_group || item.group || 'quiz',
          path: Array.isArray(item.path) ? item.path : [],
          source: 'grok'
        }));
        return;
      }

      throw new Error('No outcomes returned');
    } catch (error) {
      console.error('Error generating outcomes from API:', error);
      this.usedFallback = true;
      this.outcomes = this.buildFallbackOutcomes(this.quiz?.questions || []);
    } finally {
      this.isGenerating = false;
    }
  }

  backToQuizList(): void {
    this.router.navigate(['/admin/quiz']);
  }

  private buildFallbackOutcomes(questions: QuizQuestion[]): GeneratedOutcome[] {
    const validQuestions = (questions || []).filter(
      (question) => question?.question_key && question?.question_text?.trim()
    );

    if (!validQuestions.length) {
      return [];
    }

    const questionMap = new Map<string, QuizQuestion>();
    validQuestions.forEach((question) => questionMap.set(question.question_key, question));

    const outcomes: GeneratedOutcome[] = [];

    const walk = (
      question: QuizQuestion,
      trail: Array<{ questionText: string; optionLabel: string; optionKey: string }>
    ) => {
      const options = (question.options || []).filter(
        (option) => option?.label?.trim() && option?.option_key?.trim()
      );

      if (!options.length) {
        return;
      }

      options.forEach((option) => {
        const nextTrail = [
          ...trail,
          {
            questionText: question.question_text,
            optionLabel: option.label,
            optionKey: option.option_key
          }
        ];

        if (option.next_question_key && questionMap.has(option.next_question_key)) {
          walk(questionMap.get(option.next_question_key) as QuizQuestion, nextTrail);
          return;
        }

        outcomes.push({
          title: option.label,
          summary: nextTrail.map((item) => `${item.optionKey}: ${item.optionLabel}`).join(' | '),
          result_key: option.option_key,
          result_group: question.result_key || question.question_key,
          path: nextTrail,
          source: 'fallback'
        });
      });
    };

    walk(validQuestions[0], []);
    return outcomes;
  }
}
