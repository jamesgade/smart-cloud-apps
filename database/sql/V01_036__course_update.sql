delete from student.course 
where course_id ='27df62ec-d325-4ba7-8a74-281466974fdb'; --removed course social work

update student.course 
set name = 'Medicine (MBBS, PG)'
where name = 'Medicine';

update student.course 
set name = 'Engineering (BE, BTech, MTech)'
where name = 'Engineering';
