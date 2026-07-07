/**
 * Renders a dictionary string with the two inline markers the i18n
 * dictionaries use: **text** for emphasis and `text` for code/mono.
 * Keeps the dictionaries plain strings (no JSX) while preserving the
 * highlighted words in running copy.
 */

interface Props {
  text: string;
}

const TOKEN = /(\*\*[^*]+\*\*|`[^`]+`)/g;

export default function Rich({ text }: Props) {
  return (
    <>
      {text.split(TOKEN).map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <span key={i} className="text-slate-200">
              {part.slice(2, -2)}
            </span>
          );
        }
        if (part.startsWith('`') && part.endsWith('`')) {
          return (
            <span key={i} className="font-mono text-slate-300">
              {part.slice(1, -1)}
            </span>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}
