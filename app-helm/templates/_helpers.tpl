{{/*----- labels 模板，通用給 deployment service 確保一致性 -----*/}}
{{- define "labels" }}
{{- with .Values.labels }}
env: {{ .env }}
type: {{ .type }}
dept: {{ .dept }}
product: {{ .product }}
repo: {{ .repo }}
{{- if .tag }}
tag: {{ .tag }}
{{- end }}
{{- end }}
{{- end }}
