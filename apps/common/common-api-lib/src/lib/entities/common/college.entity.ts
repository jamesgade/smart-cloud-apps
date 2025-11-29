import { Entity, Column, Index, OneToMany } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { StudentAssignedCollege } from './student-assigned-college.entity';

@Index('colleges_pkey', ['collegeId'], { unique: true })
@Entity({ schema: 'common', name: 'colleges' })
export class College extends BaseEntity {
  @Column('uuid', {
    primary: true,
    name: 'college_id',
    default: () => 'uuid_generate_v4()',
  })
  collegeId: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  type: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  program: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  state: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  district: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  city: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  fees: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  image: string;

  @Column({ type: 'decimal', precision: 3, scale: 2, nullable: true })
  rating: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  website: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  email: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ type: 'integer', nullable: true , name:'established_year'})
  establishedYear: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  affiliation: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  accreditation: string;

  @Column({ type: 'boolean', default: true, name:'is_active' })
  isActive: boolean;

  // Enhanced fields for comprehensive college information
  
  // Academic Information (Priority 1)
  @Column({ type: 'text', array: true, nullable: true, name: 'courses_offered' })
  coursesOffered: string[];

  @Column({ type: 'varchar', length: 500, array: true, nullable: true, name: 'entrance_exams' })
  entranceExams: string[];

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true, name: 'cutoff_percentile' })
  cutoffPercentile: number;

  @Column({ type: 'date', nullable: true, name: 'application_deadline' })
  applicationDeadline: Date;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true, name: 'minimum_percentage' })
  minimumPercentage: number;

  // Financial Information (Priority 2)
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true, name: 'tuition_fee_yearly' })
  tuitionFeeYearly: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true, name: 'hostel_fee_yearly' })
  hostelFeeYearly: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true, name: 'total_fee_yearly' })
  totalFeeYearly: number;

  @Column({ type: 'boolean', default: false, nullable: true, name: 'scholarships_available' })
  scholarshipsAvailable: boolean;

  @Column({ type: 'boolean', default: false, nullable: true, name: 'loan_facilities' })
  loanFacilities: boolean;

  // Infrastructure & Facilities (Priority 3)
  @Column({ type: 'decimal', precision: 8, scale: 2, nullable: true, name: 'campus_size_acres' })
  campusSizeAcres: number;

  @Column({ type: 'boolean', default: false, nullable: true, name: 'hostel_facility' })
  hostelFacility: boolean;

  @Column({ type: 'integer', nullable: true, name: 'library_books_count' })
  libraryBooksCount: number;

  @Column({ type: 'integer', nullable: true, name: 'laboratories_count' })
  laboratoriesCount: number;

  @Column({ type: 'boolean', default: false, nullable: true, name: 'wifi_facility' })
  wifiFacility: boolean;

  // Student Statistics & Placement (Priority 4)
  @Column({ type: 'integer', nullable: true, name: 'total_students' })
  totalStudents: number;

  @Column({ type: 'integer', nullable: true, name: 'faculty_count' })
  facultyCount: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true, name: 'placement_percentage' })
  placementPercentage: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true, name: 'average_salary' })
  averageSalary: number;

  @Column({ type: 'text', array: true, nullable: true, name: 'top_recruiters' })
  topRecruiters: string[];

  @OneToMany(
    () => StudentAssignedCollege,
    (studentAssignedCollege) => studentAssignedCollege.college,
    {
      onDelete: 'CASCADE',
      onUpdate: 'NO ACTION',
    }
  )
  studentAssignedColleges: StudentAssignedCollege[];
}