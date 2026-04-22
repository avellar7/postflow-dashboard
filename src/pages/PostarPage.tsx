import { useState, useRef, useCallback } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Play } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { UploadSection } from '@/components/postar/UploadSection';
import { CaptionsSection } from '@/components/postar/CaptionsSection';
import { ScheduleSection } from '@/components/postar/ScheduleSection';
import { AdvancedSection } from '@/components/postar/AdvancedSection';
import { QueuePreviewSection } from '@/components/postar/QueuePreviewSection';
import { useQueueItems } from '@/hooks/useQueueItems';

export interface SelectedMedia {
  id: string;
  title: string;
}

export interface PostarSettings {
  mode: 'now' | 'scheduled';
  postMode: 'sequential' | 'burst';
  mediaCount: number;
  scheduledFor: string | null;
  smartProcessing: boolean;
  metadataProfile: 'auto' | 'iphone' | 'android' | 'off';
  variations: number;
  selectedCaptionId: string | null;
}

export default function PostarPage() {
  const { user } = useAuth();
  const { create: createQueueItem } = useQueueItems();

  const [selectedMedia, setSelectedMedia] = useState<SelectedMedia[]>([]);
  const [selectedCaptionId, setSelectedCaptionId] = useState<string | null>(null);
  const [mode, setMode] = useState<'now' | 'scheduled'>('now');
  const [postMode, setPostMode] = useState<'sequential' | 'burst'>('sequential');
  const [mediaCount, setMediaCount] = useState(1);
  const [scheduledFor, setScheduledFor] = useState<string>('');
  const [smartProcessing, setSmartProcessing] = useState(false);
  const [metadataProfile, setMetadataProfile] = useState<'auto' | 'iphone' | 'android' | 'off'>('auto');
  const [variations, setVariations] = useState(3);

  const handleStartAutomation = () => {
    if (selectedMedia.length === 0) {
      toast.error('Selecione ao menos uma mídia');
      return;
    }

    if (mode === 'scheduled' && !scheduledFor) {
      toast.error('Selecione uma data e hora para agendar');
      return;
    }

    // Create queue items for each selected media
    for (const media of selectedMedia) {
      createQueueItem.mutate({
        media_id: media.id,
        media_name: media.title,
        mode: mode === 'now' ? 'now' : 'scheduled',
        post_mode: postMode,
        scheduled_for: mode === 'scheduled' ? new Date(scheduledFor).toISOString() : null,
        status: 'pending',
        caption_id: selectedCaptionId,
        processing_options: {
          smart_processing: smartProcessing,
          metadata_profile: metadataProfile,
          variations,
        },
      } as any);
    }

    toast.success(`${selectedMedia.length} item(ns) adicionado(s) à fila!`);
    setSelectedMedia([]);
  };

  const handleMediaUploaded = (media: SelectedMedia) => {
    setSelectedMedia(prev => [...prev, media]);
  };

  const handleLibrarySelect = (items: Array<{ id: string; title: string }>) => {
    setSelectedMedia(prev => [
      ...prev,
      ...items.map(i => ({ id: i.id, title: i.title })),
    ]);
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="Painel de Automação"
        subtitle="Configure e dispare postagens automáticas para suas contas."
        actions={
          <Button
            className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 shadow-lg shadow-primary/20"
            onClick={handleStartAutomation}
            disabled={createQueueItem.isPending}
          >
            <Play className="w-4 h-4" /> Iniciar automação
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          <UploadSection
            selectedMedia={selectedMedia}
            onMediaUploaded={handleMediaUploaded}
            onLibrarySelect={handleLibrarySelect}
            onRemoveMedia={(id) => setSelectedMedia(prev => prev.filter(m => m.id !== id))}
          />
          <CaptionsSection
            selectedCaptionId={selectedCaptionId}
            onSelectCaption={setSelectedCaptionId}
          />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <ScheduleSection
            mode={mode}
            setMode={setMode}
            postMode={postMode}
            setPostMode={setPostMode}
            mediaCount={selectedMedia.length}
            scheduledFor={scheduledFor}
            setScheduledFor={setScheduledFor}
          />
          <AdvancedSection
            smartProcessing={smartProcessing}
            setSmartProcessing={setSmartProcessing}
            metadataProfile={metadataProfile}
            setMetadataProfile={setMetadataProfile}
            variations={variations}
            setVariations={setVariations}
          />
          <QueuePreviewSection />
        </div>
      </div>
    </DashboardLayout>
  );
}
