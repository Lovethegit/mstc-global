interface Props {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export default function IndemnityForm({ checked, onChange }: Props) {
  return (
    <div className="indemnity-checkbox-wrapper">
      <label className="flex items-start gap-3 cursor-pointer w-full">
        <div
          className="indemnity-checkbox"
          style={{
            borderColor: checked ? "oklch(var(--primary))" : undefined,
            background: checked ? "oklch(var(--primary))" : undefined,
          }}
        >
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            required
            data-ocid="form.indemnity_checkbox"
            className="sr-only"
          />
          {checked && (
            <svg
              width="14"
              height="14"
              viewBox="0 0 12 12"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M2 6L5 9L10 3"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>
        <span className="indemnity-text">
          I agree that <strong>MSTC Global is a facilitator</strong> and I
          accept the terms of service.
          <span className="indemnity-required"> *</span>
        </span>
      </label>
    </div>
  );
}
