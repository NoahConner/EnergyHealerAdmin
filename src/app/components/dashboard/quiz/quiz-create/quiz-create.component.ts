import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { HttpService } from '../../../../shared/services/http.service';

interface QuizOption {
  label: string;
  option_key: string;
  next_question_key?: string | null;
}

interface QuizQuestion {
  question_key: string;
  question_text: string;
  type: string;
  options: QuizOption[];
}

interface PreviewQuizResult {
  result_key: string;
  result_group?: string | null;
  title: string;
  summary?: string | null;
}

interface PreviewTrailStep {
  questionKey: string;
  questionText: string;
  optionKey: string;
  optionLabel: string;
}

const LEAF_PHYSICAL_OPTIONS = [
  'Fatigue or low energy',
  'Inflammation or pain',
  'Detox or immune support',
  'Hormonal imbalance',
  'Breathing or oxygen issues'
];

const DEFAULT_NESTED_QUIZ = {
  title: 'Health & Wellness Quiz',
  questions: [
    {
      question_text: 'What best describes your current concern?',
      options: [
        {
          label: 'Physical symptoms or discomfort',
          childQuestion: {
            question_text: 'Which area of your body feels most affected?',
            options: [
              {
                label: 'Brain or nervous system',
                childQuestion: {
                  question_text: 'What type of issue are you experiencing?',
                  options: LEAF_PHYSICAL_OPTIONS.map((label) => ({ label }))
                }
              },
              {
                label: 'Heart, lungs or circulation',
                childQuestion: {
                  question_text: 'What type of issue are you experiencing?',
                  options: LEAF_PHYSICAL_OPTIONS.map((label) => ({ label }))
                }
              },
              {
                label: 'Digestion or gut health',
                childQuestion: {
                  question_text: 'What type of issue are you experiencing?',
                  options: LEAF_PHYSICAL_OPTIONS.map((label) => ({ label }))
                }
              }
            ]
          }
        },
        {
          label: 'Emotional stress or anxiety',
          childQuestion: {
            question_text: 'What emotional state best describes you?',
            options: [
              { label: 'Anxious or overwhelmed' },
              { label: 'Confidence or self-esteem issues' },
              { label: 'Stuck in trauma or past patterns' },
              { label: 'Depressed or low mood' }
            ]
          }
        },
        {
          label: 'Spiritual or energetic imbalance',
          childQuestion: {
            question_text: 'What spiritual theme resonates most?',
            options: [
              { label: 'Intuition or higher awareness' },
              { label: 'Past life or soul healing' },
              { label: 'Abundance or manifestation' },
              { label: 'Feeling blocked or disconnected' }
            ]
          }
        }
      ]
    }
  ]
};

@Component({
  selector: 'app-quiz-create',
  templateUrl: './quiz-create.component.html',
  styleUrls: ['./quiz-create.component.scss']
})
export class QuizCreateComponent implements OnInit {
  quizForm: FormGroup;
  isQuizPreviewOpen = false;
  isQuizPreviewLoading = false;
  quizPreviewError: string | null = null;
  previewQuiz: { title: string; questions: QuizQuestion[]; results: PreviewQuizResult[] } | null = null;
  previewQuestionKey: string | null = null;
  previewResult: PreviewQuizResult | null = null;
  previewTrail: PreviewTrailStep[] = [];

  constructor(
    private fb: FormBuilder,
    private http: HttpService,
    private router: Router
  ) {
    this.quizForm = this.fb.group({
      title: ['', Validators.required],
      questions: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.prefillQuiz(DEFAULT_NESTED_QUIZ);
  }

  // ================= GETTERS =================
  get questions(): FormArray {
    return this.quizForm.get('questions') as FormArray;
  }

  getOptions(questionControl: AbstractControl): FormArray {
    return questionControl.get('options') as FormArray;
  }

  getAlphabetLabel(index: number): string {
    return String.fromCharCode(65 + index);
  }

  get previewQuestion(): QuizQuestion | null {
    if (!this.previewQuiz?.questions?.length || !this.previewQuestionKey) {
      return null;
    }

    return this.previewQuiz.questions.find(
      (question) => question.question_key === this.previewQuestionKey
    ) || null;
  }

  hasChildQuestion(optionControl: AbstractControl): boolean {
    return optionControl.get('childQuestion') instanceof FormGroup;
  }

  getChildQuestion(optionControl: AbstractControl): FormGroup | null {
    return (optionControl.get('childQuestion') as FormGroup) || null;
  }

  addRootQuestion(): void {
    this.questions.push(this.createQuestionGroup());
  }

  removeRootQuestion(index: number): void {
    this.questions.removeAt(index);
  }

  addOption(questionControl: AbstractControl): void {
    this.getOptions(questionControl).push(this.createOptionGroup());
  }

  removeOption(questionControl: AbstractControl, optionIndex: number): void {
    this.getOptions(questionControl).removeAt(optionIndex);
  }

  addChildQuestion(optionControl: AbstractControl): void {
    if (this.hasChildQuestion(optionControl)) {
      return;
    }

    (optionControl as FormGroup).addControl('childQuestion', this.createQuestionGroup());
  }

  removeChildQuestion(optionControl: AbstractControl): void {
    if (!this.hasChildQuestion(optionControl)) {
      return;
    }

    (optionControl as FormGroup).removeControl('childQuestion');
  }

  prefillQuiz(payload: any): void {
    this.quizForm.patchValue({
      title: payload?.title || ''
    });

    this.questions.clear({ emitEvent: false });

    (payload?.questions || []).forEach((question: any) => {
      this.questions.push(this.createQuestionGroup(question), { emitEvent: false });
    });
  }

  async openQuizPreview(): Promise<void> {
    this.isQuizPreviewLoading = true;
    this.quizPreviewError = null;

    try {
      const res: any = await this.http.get('/get_all_quizzes', true).toPromise();
      const quizzes = Array.isArray(res?.data) ? res.data : [];
      const formTitle = (this.quizForm.get('title')?.value || '').trim().toLowerCase();

      const matchedQuiz = [...quizzes].reverse().find((quiz: any) => {
        const title = String(quiz?.title || '').trim().toLowerCase();
        return formTitle && title === formTitle;
      }) || quizzes[quizzes.length - 1];

      this.startQuizPreview(matchedQuiz || this.buildPreviewQuizFromForm());
    } catch (error) {
      console.error('Error fetching quiz preview:', error);
      this.quizPreviewError = 'Unable to load quiz from API. Showing current draft preview instead.';
      this.startQuizPreview(this.buildPreviewQuizFromForm());
    } finally {
      this.isQuizPreviewLoading = false;
    }
  }

  closeQuizPreview(): void {
    this.isQuizPreviewOpen = false;
    this.previewQuiz = null;
    this.previewQuestionKey = null;
    this.previewResult = null;
    this.previewTrail = [];
  }

  answerPreview(option: QuizOption): void {
    const question = this.previewQuestion;

    if (!question) {
      return;
    }

    this.previewTrail = [
      ...this.previewTrail,
      {
        questionKey: question.question_key,
        questionText: question.question_text,
        optionKey: option.option_key,
        optionLabel: option.label
      }
    ];

    if (option.next_question_key) {
      this.previewQuestionKey = option.next_question_key;
      return;
    }

    this.previewQuestionKey = null;
    this.previewResult = {
      result_key: option.option_key,
      result_group: question.question_key,
      title: option.label,
      summary: ''
    };
  }

  restartQuizPreview(): void {
    if (!this.previewQuiz?.questions?.length) {
      return;
    }

    this.previewQuestionKey = this.previewQuiz.questions[0].question_key;
    this.previewResult = null;
    this.previewTrail = [];
  }

  save(): void {
    if (this.quizForm.invalid || !this.questions.length) {
      this.quizForm.markAllAsTouched();
      return;
    }

    const payload = this.buildSavePayload();

    this.http.post('/quiz/create', payload, true).subscribe({
      next: () => {
        Swal.fire('Success', 'Quiz created successfully', 'success');
        this.router.navigate(['/admin/quiz']);
      },
      error: () => {
        Swal.fire('Error', 'Something went wrong', 'error');
      }
    });
  }

  private createQuestionGroup(question?: any): FormGroup {
    return this.fb.group({
      question_text: [question?.question_text || '', Validators.required],
      type: [question?.type || 'single'],
      options: this.fb.array(
        (question?.options || []).map((option: any) => this.createOptionGroup(option))
      )
    });
  }

  private createOptionGroup(option?: any): FormGroup {
    const group: FormGroup = this.fb.group({
      label: [option?.label || '', Validators.required]
    });

    if (option?.childQuestion) {
      group.addControl('childQuestion', this.createQuestionGroup(option.childQuestion));
    }

    return group;
  }

  private buildSavePayload(): { title: string; questions: QuizQuestion[] } {
    const flatQuestions: QuizQuestion[] = [];
    let questionCounter = 1;

    const visitQuestion = (questionControl: AbstractControl): string => {
      const raw = questionControl.getRawValue();
      const questionKey = `q${questionCounter++}`;
      const flatQuestion: QuizQuestion = {
        question_key: questionKey,
        question_text: raw.question_text,
        type: raw.type || 'single',
        options: []
      };

      flatQuestions.push(flatQuestion);

      this.getOptions(questionControl).controls.forEach((optionControl, index) => {
        const optionLabel = String(optionControl.get('label')?.value || '').trim();
        const optionKey = this.buildOptionKey(optionLabel, index);
        const childQuestion = this.getChildQuestion(optionControl);

        const option: QuizOption = {
          option_key: optionKey,
          label: optionLabel
        };

        if (childQuestion) {
          option.next_question_key = visitQuestion(childQuestion);
        }

        flatQuestion.options.push(option);
      });

      return questionKey;
    };

    this.questions.controls.forEach((questionControl) => visitQuestion(questionControl));

    return {
      title: String(this.quizForm.get('title')?.value || '').trim(),
      questions: flatQuestions
    };
  }

  private buildPreviewQuizFromForm(): { title: string; questions: QuizQuestion[]; results: PreviewQuizResult[] } {
    const payload = this.buildSavePayload();
    return {
      ...payload,
      results: []
    };
  }

  private startQuizPreview(quiz: any): void {
    if (!quiz?.questions?.length) {
      this.quizPreviewError = 'No quiz questions available for preview.';
      return;
    }

    this.previewQuiz = {
      title: quiz.title,
      questions: quiz.questions,
      results: Array.isArray(quiz.results) ? quiz.results : []
    };
    this.previewQuestionKey = quiz.questions[0].question_key;
    this.previewResult = null;
    this.previewTrail = [];
    this.isQuizPreviewOpen = true;
  }

  private buildOptionKey(label: string, index: number): string {
    const normalized = label
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '')
      .slice(0, 40);

    return normalized || `option_${index + 1}`;
  }
}
