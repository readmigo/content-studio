'use client';

import { useState } from 'react';
import { useEnvStore } from '@/stores/env-store';
import { ENVIRONMENTS, EnvironmentName } from '@/config/environments';
import { cn } from '@/lib/utils';
import {
  ArrowRight,
  Download,
  Upload,
  AlertTriangle,
  Loader2,
  Construction,
  CheckCircle,
} from 'lucide-react';
import * as Select from '@radix-ui/react-select';
import { ChevronDown } from 'lucide-react';

interface ExportableRule {
  id: string;
  name: string;
  confidence: number;
  isSelected: boolean;
}

export default function RuleMigrationPage() {
  const { currentEnv } = useEnvStore();
  const [exportRules, setExportRules] = useState<ExportableRule[]>([]);
  const [targetEnv, setTargetEnv] = useState<EnvironmentName | ''>('');
  const [sourceEnv, setSourceEnv] = useState<EnvironmentName | ''>('');
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);

  const handleToggleRule = (ruleId: string) => {
    setExportRules((prev) =>
      prev.map((r) =>
        r.id === ruleId ? { ...r, isSelected: !r.isSelected } : r
      )
    );
  };

  const handleSelectAll = () => {
    const allSelected = exportRules.every((r) => r.isSelected);
    setExportRules((prev) =>
      prev.map((r) => ({ ...r, isSelected: !allSelected }))
    );
  };

  const handleExport = async () => {
    setExporting(true);
    // Simulate export
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setExporting(false);
    alert('导出申请已提交！');
  };

  const handleImport = async () => {
    setImporting(true);
    // Simulate import
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setImporting(false);
    alert('导入成功！');
  };

  const selectedCount = exportRules.filter((r) => r.isSelected).length;
  const availableTargetEnvs = (Object.keys(ENVIRONMENTS) as EnvironmentName[])
    .filter((env) => env !== currentEnv);
  const availableSourceEnvs = (Object.keys(ENVIRONMENTS) as EnvironmentName[])
    .filter((env) => env !== currentEnv && env !== 'production');

  // Check if there are rules to show
  const hasRules = exportRules.length > 0;

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold">规则迁移</h1>
        <p className="text-muted-foreground mt-1">
          当前环境: {ENVIRONMENTS[currentEnv].icon} {ENVIRONMENTS[currentEnv].name}
        </p>
      </div>

      {/* Feature under development notice */}
      {!hasRules && (
        <div className="border rounded-lg p-8 text-center">
          <Construction className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-lg font-semibold mb-2">功能开发中</h2>
          <p className="text-muted-foreground">
            规则迁移功能正在开发中，敬请期待。
          </p>
        </div>
      )}

      {/* Export Section */}
      {hasRules && <div className="border rounded-lg p-6">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Download className="w-5 h-5" />
          导出规则到其他环境
        </h2>

        <div className="mt-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-muted-foreground">
              选择要导出的规则:
            </span>
            <button
              onClick={handleSelectAll}
              className="text-sm text-primary hover:underline"
            >
              {exportRules.every((r) => r.isSelected) ? '取消全选' : '全选'}
            </button>
          </div>

          <div className="space-y-2 max-h-[200px] overflow-auto border rounded-lg p-3">
            {exportRules.map((rule) => (
              <label
                key={rule.id}
                className={cn(
                  'flex items-center gap-3 p-2 rounded cursor-pointer hover:bg-muted',
                  rule.isSelected && 'bg-primary/10'
                )}
              >
                <input
                  type="checkbox"
                  checked={rule.isSelected}
                  onChange={() => handleToggleRule(rule.id)}
                  className="w-4 h-4"
                />
                <span className="flex-1">{rule.name}</span>
                <span className={cn(
                  'text-xs px-2 py-0.5 rounded',
                  rule.confidence >= 0.9 ? 'bg-green-100 text-green-700' :
                  rule.confidence >= 0.8 ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                )}>
                  {Math.round(rule.confidence * 100)}%
                </span>
                {rule.confidence < 0.8 && (
                  <span title="置信度较低">
                    <AlertTriangle className="w-4 h-4 text-yellow-500" />
                  </span>
                )}
              </label>
            ))}
          </div>
        </div>

        <div className="mt-4 flex items-center gap-4">
          <span className="text-sm">目标环境:</span>
          <Select.Root value={targetEnv} onValueChange={(v) => setTargetEnv(v as EnvironmentName)}>
            <Select.Trigger className="flex items-center gap-2 px-3 py-2 rounded-md border bg-white dark:bg-zinc-900 min-w-[180px]">
              <Select.Value placeholder="选择目标环境" />
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </Select.Trigger>
            <Select.Portal>
              <Select.Content className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg border p-1 z-50">
                <Select.Viewport>
                  {availableTargetEnvs.map((env) => (
                    <Select.Item
                      key={env}
                      value={env}
                      className="px-3 py-2 rounded cursor-pointer hover:bg-muted outline-none"
                    >
                      <Select.ItemText>
                        {ENVIRONMENTS[env].icon} {ENVIRONMENTS[env].name}
                      </Select.ItemText>
                    </Select.Item>
                  ))}
                </Select.Viewport>
              </Select.Content>
            </Select.Portal>
          </Select.Root>
        </div>

        {targetEnv === 'production' && (
          <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 rounded-lg flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-yellow-800 dark:text-yellow-200">
              <p className="font-medium">导出到 Production 需要管理员审批</p>
              <p className="text-yellow-700 dark:text-yellow-300">
                提交申请后，需要管理员审核通过才能完成导入。
              </p>
            </div>
          </div>
        )}

        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            已选择 {selectedCount} 条规则
          </span>
          <button
            onClick={handleExport}
            disabled={selectedCount === 0 || !targetEnv || exporting}
            className="flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {exporting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <ArrowRight className="w-4 h-4" />
            )}
            {targetEnv === 'production' ? '提交导出申请' : '导出规则'}
          </button>
        </div>
      </div>}

      {/* Import Section */}
      {hasRules && <div className="border rounded-lg p-6">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Upload className="w-5 h-5" />
          从其他环境导入规则
        </h2>

        <div className="mt-4 flex items-center gap-4">
          <span className="text-sm">源环境:</span>
          <Select.Root value={sourceEnv} onValueChange={(v) => setSourceEnv(v as EnvironmentName)}>
            <Select.Trigger className="flex items-center gap-2 px-3 py-2 rounded-md border bg-white dark:bg-zinc-900 min-w-[180px]">
              <Select.Value placeholder="选择源环境" />
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </Select.Trigger>
            <Select.Portal>
              <Select.Content className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg border p-1 z-50">
                <Select.Viewport>
                  {availableSourceEnvs.map((env) => (
                    <Select.Item
                      key={env}
                      value={env}
                      className="px-3 py-2 rounded cursor-pointer hover:bg-muted outline-none"
                    >
                      <Select.ItemText>
                        {ENVIRONMENTS[env].icon} {ENVIRONMENTS[env].name}
                      </Select.ItemText>
                    </Select.Item>
                  ))}
                </Select.Viewport>
              </Select.Content>
            </Select.Portal>
          </Select.Root>
        </div>

        {sourceEnv && (
          <div className="mt-4">
            <p className="text-sm text-muted-foreground mb-3">
              可导入的规则 (来自 {ENVIRONMENTS[sourceEnv].name}):
            </p>

            <div className="space-y-2 border rounded-lg p-3">
              <label className="flex items-center gap-3 p-2 rounded cursor-pointer hover:bg-muted">
                <input type="checkbox" className="w-4 h-4" defaultChecked />
                <span className="flex-1">新规则A</span>
                <span className="text-xs text-green-600 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" />
                  验证通过
                </span>
              </label>
              <label className="flex items-center gap-3 p-2 rounded cursor-pointer hover:bg-muted">
                <input type="checkbox" className="w-4 h-4" defaultChecked />
                <span className="flex-1">新规则B</span>
                <span className="text-xs text-green-600 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" />
                  验证通过
                </span>
              </label>
              <label className="flex items-center gap-3 p-2 rounded cursor-pointer hover:bg-muted opacity-60">
                <input type="checkbox" className="w-4 h-4" disabled />
                <span className="flex-1">实验规则C</span>
                <span className="text-xs text-yellow-600">仍在测试中</span>
              </label>
            </div>
          </div>
        )}

        <div className="mt-4 flex justify-end">
          <button
            onClick={handleImport}
            disabled={!sourceEnv || importing}
            className="flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {importing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Upload className="w-4 h-4" />
            )}
            导入选中规则
          </button>
        </div>
      </div>}
    </div>
  );
}
