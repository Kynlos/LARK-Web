import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../../../tests/utils/test-utils';
import { QuickActionBar } from '../QuickActionBar';
import { useAIStore } from '../../../stores/aiStore';
import { AIService } from '../../../services/AIService';

vi.mock('../../../stores/aiStore');
vi.mock('../../../services/AIService');

describe('QuickActionBar', () => {
  const mockOnFormatText = vi.fn();
  const mockOnAIAction = vi.fn();
  const mockGetSelectedText = vi.fn();

  const mockProvider = {
    name: 'TestProvider',
    apiEndpoint: 'https://api.test.com',
    apiKey: 'test-key',
    modelName: 'test-model',
    temperature: 0.7,
    maxTokens: 2000,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    
    (useAIStore as any).mockReturnValue({
      settings: {
        activeProvider: 'TestProvider',
        providers: [mockProvider],
      },
    });

    const mockAIService = {
      setProvider: vi.fn(),
      improveWriting: vi.fn().mockResolvedValue('Improved text'),
      suggestContinuation: vi.fn().mockResolvedValue('Continuation text'),
      brainstormIdeas: vi.fn().mockResolvedValue(['Idea 1', 'Idea 2', 'Idea 3']),
      getChatCompletion: vi.fn().mockResolvedValue({
        message: { content: 'Custom response' },
      }),
    };

    (AIService.getInstance as any).mockReturnValue(mockAIService);
  });

  it('should render formatting buttons', () => {
    render(
      <QuickActionBar
        onFormatText={mockOnFormatText}
        onAIAction={mockOnAIAction}
        getSelectedText={mockGetSelectedText}
      />
    );

    expect(screen.getByLabelText(/bold/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/italic/i)).toBeInTheDocument();
  });

  it('should render AI action buttons', () => {
    render(
      <QuickActionBar
        onFormatText={mockOnFormatText}
        onAIAction={mockOnAIAction}
        getSelectedText={mockGetSelectedText}
      />
    );

    expect(screen.getByLabelText(/improve writing/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/continue writing/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/brainstorm ideas/i)).toBeInTheDocument();
  });

  it('should disable buttons when no text is selected', () => {
    mockGetSelectedText.mockReturnValue('');

    render(
      <QuickActionBar
        onFormatText={mockOnFormatText}
        onAIAction={mockOnAIAction}
        getSelectedText={mockGetSelectedText}
      />
    );

    const boldButton = screen.getByLabelText(/bold/i);
    expect(boldButton).toBeDisabled();
  });

  it('should enable buttons when text is selected', () => {
    mockGetSelectedText.mockReturnValue('Selected text');

    render(
      <QuickActionBar
        onFormatText={mockOnFormatText}
        onAIAction={mockOnAIAction}
        getSelectedText={mockGetSelectedText}
      />
    );

    const boldButton = screen.getByLabelText(/bold/i);
    expect(boldButton).not.toBeDisabled();
  });

  it('should call onFormatText when format button is clicked', () => {
    mockGetSelectedText.mockReturnValue('Selected text');

    render(
      <QuickActionBar
        onFormatText={mockOnFormatText}
        onAIAction={mockOnAIAction}
        getSelectedText={mockGetSelectedText}
      />
    );

    const boldButton = screen.getByLabelText(/bold/i);
    fireEvent.click(boldButton);

    expect(mockOnFormatText).toHaveBeenCalledWith('bold');
  });

  it('should call AI service when improve writing is clicked', async () => {
    mockGetSelectedText.mockReturnValue('Selected text');

    render(
      <QuickActionBar
        onFormatText={mockOnFormatText}
        onAIAction={mockOnAIAction}
        getSelectedText={mockGetSelectedText}
      />
    );

    const improveButton = screen.getByLabelText(/improve writing/i);
    fireEvent.click(improveButton);

    await waitFor(() => {
      expect(mockOnAIAction).toHaveBeenCalledWith('Selected text', 'Improved text');
    });
  });

  it('should show alert when AI action is attempted without provider', async () => {
    (useAIStore as any).mockReturnValue({
      settings: {
        activeProvider: '',
        providers: [],
      },
    });

    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    mockGetSelectedText.mockReturnValue('Selected text');

    render(
      <QuickActionBar
        onFormatText={mockOnFormatText}
        onAIAction={mockOnAIAction}
        getSelectedText={mockGetSelectedText}
      />
    );

    const improveButton = screen.getByLabelText(/improve writing/i);
    fireEvent.click(improveButton);

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith(
        expect.stringContaining('configure an AI provider')
      );
    });

    alertSpy.mockRestore();
  });

  it('should show alert when no text is selected for AI action', async () => {
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    mockGetSelectedText.mockReturnValue('');

    render(
      <QuickActionBar
        onFormatText={mockOnFormatText}
        onAIAction={mockOnAIAction}
        getSelectedText={mockGetSelectedText}
      />
    );

    const improveButton = screen.getByLabelText(/improve writing/i);
    
    fireEvent.click(improveButton);

    alertSpy.mockRestore();
  });

  it('should open custom prompt dialog', () => {
    mockGetSelectedText.mockReturnValue('Selected text');

    render(
      <QuickActionBar
        onFormatText={mockOnFormatText}
        onAIAction={mockOnAIAction}
        getSelectedText={mockGetSelectedText}
      />
    );

    const customButton = screen.getByLabelText(/custom prompt/i);
    fireEvent.click(customButton);

    expect(screen.getByText(/custom ai prompt/i)).toBeInTheDocument();
  });
});
