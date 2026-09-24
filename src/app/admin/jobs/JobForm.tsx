import Link from "next/link";
import { createJob, updateJob } from "../actions";

type JobValue = {
  id?: string; title?: string; slug?: string; team?: string; summary?: string; description?: string;
  responsibilities?: string; requirements?: string; location?: string; workplaceType?: string;
  employmentType?: string; compensation?: string | null; status?: string; applicationOpen?: boolean;
  displayOrder?: number; requireResume?: boolean; requireAddress?: boolean; requirePhone?: boolean;
  requireMessage?: boolean; collectHostingDetails?: boolean;
};

export default function JobForm({ job }: { job?: JobValue }) {
  const editing = Boolean(job?.id);
  return <form className="admin-form" action={editing ? updateJob : createJob}>
    {job?.id && <input type="hidden" name="id" value={job.id} />}
    <div className="admin-form-section"><div><span>Position</span><h2>Job information</h2></div><div className="admin-fields"><label>Title *<input name="title" defaultValue={job?.title} required /></label><div className="admin-field-row"><label>Slug<input name="slug" defaultValue={job?.slug} placeholder="Generated from title" /></label><label>Team / department *<input name="team" defaultValue={job?.team} required /></label></div><label>Short summary *<textarea name="summary" rows={2} defaultValue={job?.summary} required /></label><label>Full description *<textarea name="description" rows={6} defaultValue={job?.description} required /></label></div></div>
    <div className="admin-form-section"><div><span>Role details</span><h2>Expectations</h2><p>Enter one responsibility or requirement per line.</p></div><div className="admin-fields"><label>Responsibilities *<textarea name="responsibilities" rows={7} defaultValue={job?.responsibilities} required /></label><label>Requirements *<textarea name="requirements" rows={7} defaultValue={job?.requirements} required /></label><label>Compensation<input name="compensation" defaultValue={job?.compensation ?? ""} /></label></div></div>
    <div className="admin-form-section"><div><span>Logistics</span><h2>Location &amp; status</h2></div><div className="admin-fields"><div className="admin-field-row"><label>Location *<input name="location" defaultValue={job?.location} required /></label><label>Employment type *<input name="employmentType" defaultValue={job?.employmentType ?? "Full-time"} required /></label></div><div className="admin-field-row"><label>Workplace type<select name="workplaceType" defaultValue={job?.workplaceType ?? "remote"}><option value="remote">Remote</option><option value="hybrid">Hybrid</option><option value="on-site">On-site</option></select></label><label>Status<select name="status" defaultValue={job?.status ?? "draft"}><option value="draft">Draft</option><option value="published">Published</option><option value="closed">Closed</option><option value="archived">Archived</option></select></label></div><label>Display order<input type="number" name="displayOrder" defaultValue={job?.displayOrder ?? 0} /></label></div></div>
    <div className="admin-form-section"><div><span>Application</span><h2>Form settings</h2></div><div className="admin-check-grid"><label><input type="checkbox" name="applicationOpen" defaultChecked={job?.applicationOpen ?? true} /> Accept applications when published</label><label><input type="checkbox" name="requireResume" defaultChecked={job?.requireResume ?? true} /> Require résumé</label><label><input type="checkbox" name="requireAddress" defaultChecked={job?.requireAddress} /> Require full address</label><label><input type="checkbox" name="requirePhone" defaultChecked={job?.requirePhone} /> Require phone number</label><label><input type="checkbox" name="requireMessage" defaultChecked={job?.requireMessage ?? true} /> Require applicant message</label><label><input type="checkbox" name="collectHostingDetails" defaultChecked={job?.collectHostingDetails} /> Collect hosting setup details</label></div></div>
    <div className="admin-form-actions"><Link href="/admin/jobs">Cancel</Link><button type="submit">{editing ? "Save changes" : "Create job"}</button></div>
  </form>;
}
