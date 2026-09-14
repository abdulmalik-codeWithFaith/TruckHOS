import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { TripRequest } from "../types/trip";
import "./TripForm.css";

interface TripFormProps {
  onSubmit: (data: TripRequest) => void;
  isLoading: boolean;
}

interface FormState {
  current_location: string;
  pickup_location: string;
  dropoff_location: string;
  current_cycle_used: string;
}

const initialState: FormState = {
  current_location: "",
  pickup_location: "",
  dropoff_location: "",
  current_cycle_used: "",
};

type FieldErrors = Partial<Record<keyof FormState, string>>;

function validate(values: FormState): FieldErrors {
  const errors: FieldErrors = {};

  if (!values.current_location.trim()) {
    errors.current_location = "Enter a starting location.";
  }
  if (!values.pickup_location.trim()) {
    errors.pickup_location = "Enter a pickup location.";
  }
  if (!values.dropoff_location.trim()) {
    errors.dropoff_location = "Enter a dropoff location.";
  }
  if (
    values.pickup_location.trim() &&
    values.dropoff_location.trim() &&
    values.pickup_location.trim().toLowerCase() ===
      values.dropoff_location.trim().toLowerCase()
  ) {
    errors.dropoff_location = "Pickup and dropoff can't be the same place.";
  }

  const cycle = values.current_cycle_used.trim();
  if (cycle === "") {
    errors.current_cycle_used = "Enter hours used in the current cycle.";
  } else {
    const num = Number(cycle);
    if (Number.isNaN(num)) {
      errors.current_cycle_used = "Enter a number.";
    } else if (num < 0) {
      errors.current_cycle_used = "Cycle hours can't be negative.";
    } else if (num > 70) {
      errors.current_cycle_used = "Cycle hours can't exceed the 70-hour/8-day limit.";
    }
  }

  return errors;
}

interface FieldProps {
  id: keyof FormState;
  label: string;
  placeholder: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
  type?: string;
  suffix?: string;
}

function Field({ id, label, placeholder, value, error, onChange, type = "text", suffix }: FieldProps) {
  return (
    <div className="field">
      <label className="field__label" htmlFor={id}>
        {label}
      </label>
      <div className={`field__control ${error ? "field__control--error" : ""}`}>
        <input
          id={id}
          name={id}
          type={type}
          inputMode={type === "number" ? "decimal" : undefined}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
        />
        {suffix && <span className="field__suffix">{suffix}</span>}
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            id={`${id}-error`}
            className="field__error"
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: "auto", marginTop: 6 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.18 }}
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function TripForm({ onSubmit, isLoading }: TripFormProps) {
  const [values, setValues] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState(false);

  function update(field: keyof FormState, value: string) {
    const next = { ...values, [field]: value };
    setValues(next);
    if (touched) {
      setErrors(validate(next));
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setTouched(true);
    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) {
      onSubmit({
        current_location: values.current_location.trim(),
        pickup_location: values.pickup_location.trim(),
        dropoff_location: values.dropoff_location.trim(),
        current_cycle_used: Number(values.current_cycle_used),
      });
    }
  }

  return (
    <motion.form
      className="trip-form"
      onSubmit={handleSubmit}
      noValidate
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className="trip-form__header">
        <h2>Plan your trip</h2>
        <p>Enter the route and your current cycle to generate a compliant schedule.</p>
      </div>

      <Field
        id="current_location"
        label="Current location"
        placeholder="Chicago, IL"
        value={values.current_location}
        error={errors.current_location}
        onChange={(v) => update("current_location", v)}
      />
      <Field
        id="pickup_location"
        label="Pickup location"
        placeholder="Denver, CO"
        value={values.pickup_location}
        error={errors.pickup_location}
        onChange={(v) => update("pickup_location", v)}
      />
      <Field
        id="dropoff_location"
        label="Dropoff location"
        placeholder="Los Angeles, CA"
        value={values.dropoff_location}
        error={errors.dropoff_location}
        onChange={(v) => update("dropoff_location", v)}
      />
      <Field
        id="current_cycle_used"
        label="Current cycle used"
        placeholder="30"
        value={values.current_cycle_used}
        error={errors.current_cycle_used}
        onChange={(v) => update("current_cycle_used", v)}
        type="number"
        suffix="hours"
      />

      <motion.button
        type="submit"
        className="trip-form__submit"
        disabled={isLoading}
        whileTap={{ scale: 0.98 }}
      >
        {isLoading ? (
          <span className="trip-form__submit-loading">
            <span className="spinner" aria-hidden="true" />
            Planning your trip…
          </span>
        ) : (
          "Plan trip"
        )}
      </motion.button>
    </motion.form>
  );
}